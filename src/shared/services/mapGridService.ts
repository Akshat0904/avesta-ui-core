import { TGeoJSONFeature, TGeoJSONPolygonCoordinates, IGeoSpatialService } from '@shared/interfaces/geoSpatialService';
import { EGridLevel } from '@listingSr/core/types/listingSrEnum';
import { TExtendedGeoJSONFeature, TLargeGridData, TSmallGridInfo } from '@listingSr/core/types/listingSrTypes';
import { removeDuplicateObjectsFromArray } from '../utils/utils';
import { IMapInteractionService } from '../interfaces/mapInteractionInterface';
import { debounceDelayKeys } from '../constants/constants';
import { BoundingBoxService } from './boundingBoxService';

type TGridData = {
	bounds: string;
	gridId: string;
	boundaryJson: string;
};

type TMediumGridInfo = {
	boundaryBoxMed: number[];
	gridPolygonCellFeature: TGeoJSONFeature;
	medGridId: string;
};

type GeoJSONPolygon = {
	type: 'Polygon';
	coordinates: TGeoJSONPolygonCoordinates;
};

type TGridIdCollections = {
	largeGridIds: string[];
	mediumGridIds: string[];
	smallGridIds: string[];
};

type TGeoOptions = {
	units: 'miles' | 'kilometers' | 'degrees' | 'radians' | undefined;
};

export class MapGridService {
	constructor(
		private mapService: IMapInteractionService,
		private geoSpatialService: IGeoSpatialService,
		private boundingBoxService: BoundingBoxService
	) {}
	/*
    boundingBox - [minX, minY, maxX, maxY]
  */
	public async getGrids() {
		if (!this.mapService) {
			return null;
		}
		const maxRetries = 10;
		let attempts = 0;
		try {
			const boundingBox = this.boundingBoxService.getBoundingBox();

			if (!boundingBox) {
				throw new Error('No bounding box available.');
			}
			const boundingBoxPolygon = this.geoSpatialService.bBoxPolygon(boundingBox);
			const gridLevel = this.determineGridLevel(boundingBox);
			if (gridLevel) {
				while (attempts < maxRetries) {
					const largeGridDetails = await this.fetchLargeGrids(boundingBox);
					if (!largeGridDetails?.length) {
						attempts++;
						await new Promise((resolve) => setTimeout(resolve, 200));
						continue;
					}
					const gridIds = await this.processLargeGrids(largeGridDetails, gridLevel, boundingBoxPolygon);
					return { gridIds, gridLevel };
				}
				return null;
			}
			return null;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	// Determine grid level based on the bounding box length
	private determineGridLevel(boundingBox: number[]): EGridLevel | null {
		let gridLevel = EGridLevel.large;
		const formattedBoundingBox = this.formatBoundingBox(boundingBox);
		const coordinates = {
			topPoint: [formattedBoundingBox.topLeftLatitude, formattedBoundingBox.topLeftLongitude],
			bottomPoint: [formattedBoundingBox.bottomRightLatitude, formattedBoundingBox.topLeftLongitude],
			leftPoint: [formattedBoundingBox.topLeftLatitude, formattedBoundingBox.topLeftLongitude],
			rightPoint: [formattedBoundingBox.topLeftLatitude, formattedBoundingBox.bottomRightLongitude]
		};

		// calculating the distance between the top and bottom points of a bounding box
		const calculateVerticalDistanceOfBoundingBox = this.geoSpatialService.distance(
			coordinates.topPoint,
			coordinates.bottomPoint,
			'meters'
		);

		const calculateHorizontalDistanceOfBoundingBox = this.geoSpatialService.distance(
			coordinates.leftPoint,
			coordinates.rightPoint,
			'meters'
		);
		const smallRows = Math.ceil(calculateVerticalDistanceOfBoundingBox / 500);
		let distance = 50000;
		if (smallRows <= 30) {
			distance = 500;
			gridLevel = EGridLevel.small;
		}
		if (smallRows > 30 && smallRows <= 500) {
			distance = 5000;
			gridLevel = EGridLevel.medium;
		}

		const gridRows = Math.ceil(calculateVerticalDistanceOfBoundingBox / distance);
		const gridCols = Math.ceil(calculateHorizontalDistanceOfBoundingBox / distance);
		if (gridRows * gridCols > 1000) {
			return null;
		}
		return gridLevel;
	}

	public formatBoundingBox(boundingBox: number[]) {
		return {
			topLeftLatitude: parseFloat(boundingBox[3]?.toFixed(7)),
			topLeftLongitude: parseFloat(boundingBox[0]?.toFixed(7)),
			bottomRightLatitude: parseFloat(boundingBox[1]?.toFixed(7)),
			bottomRightLongitude: parseFloat(boundingBox[2]?.toFixed(7))
		};
	}

	// Fetch large grids within a given bounding box
	private async fetchLargeGrids(boundingBox: number[]) {
		let largeGridFeatures = await this.mapService.getFeaturesInBoundingBox(boundingBox, 'largeGrid');
		largeGridFeatures = largeGridFeatures.filter((item) => item.gridId);
		if (!largeGridFeatures || largeGridFeatures.length === 0) {
			return;
		}
		return removeDuplicateObjectsFromArray(largeGridFeatures, 'gridId');
	}

	// Process large grids based on grid level and update gridIds object
	private async processLargeGrids(
		largeGridDetails: TLargeGridData[],
		gridLevel: EGridLevel,
		boundingBoxPolygon: TGeoJSONFeature<GeoJSONPolygon>
	) {
		let gridIds: TGridIdCollections = { largeGridIds: [], mediumGridIds: [], smallGridIds: [] };
		if (largeGridDetails.length === 0) {
			await new Promise((resolve) => setTimeout(resolve, debounceDelayKeys.delay));
		}
		const largeGridIds = largeGridDetails.map((item: TLargeGridData) => item.gridId).filter(Boolean);
		if (!largeGridIds || largeGridIds.length === 0) {
			return;
		}
		gridIds = {
			...gridIds,
			largeGridIds
		};
		if (gridLevel === EGridLevel.medium || gridLevel === EGridLevel.small) {
			const mediumGridData = this.getMediumGridFromLargeGrid(largeGridDetails, boundingBoxPolygon);
			if (!mediumGridData) {
				return;
			}
			const generatedMediumGridIds = mediumGridData.map((item) => item.medGridId);
			if (!generatedMediumGridIds) {
				return;
			}
			gridIds = {
				...gridIds,
				mediumGridIds: generatedMediumGridIds
			};
			if (gridLevel === EGridLevel.small) {
				const smallGridData = this.getSmallGridFromLargeGrid(mediumGridData, boundingBoxPolygon);
				if (!smallGridData) {
					return;
				}
				const generatedSmallGridIds = smallGridData.map((item) => item.smallGridId);
				if (!generatedSmallGridIds) {
					return;
				}
				gridIds = {
					...gridIds,
					smallGridIds: generatedSmallGridIds
				};
			}
		}
		switch (gridLevel) {
			case EGridLevel.large:
				return gridIds.largeGridIds;
			case EGridLevel.medium:
				return gridIds.mediumGridIds;
			case EGridLevel.small:
				return gridIds.smallGridIds;
			default:
				throw new Error(`Unsupported grid level: ${gridLevel}`);
		}
	}

	private getMediumGridFromLargeGrid(
		largeGridDetails: TGridData[],
		boundingBoxPolygon: TGeoJSONFeature<GeoJSONPolygon>
	) {
		const mediumGridData: TMediumGridInfo[] = [];
		for (let i = 0; i < largeGridDetails.length; i++) {
			const largeGridId = largeGridDetails[i].gridId;
			const GridLevelCellSide = 5;
			const options: TGeoOptions = { units: 'kilometers' };
			const featureCollection = this.geoSpatialService.squareGrid(
				JSON.parse(largeGridDetails[i].bounds),
				GridLevelCellSide,
				options
			);
			if (!featureCollection.features.length) {
				return;
			}
			const arrangedFeatureCollection = this.reArrangeToGridWithExcelLabels(
				featureCollection.features,
				10,
				10,
				EGridLevel.medium
			);
			for (let idx = 0; idx < arrangedFeatureCollection.length; idx++) {
				const gridPolygonCellFeature = arrangedFeatureCollection[idx];
				const medGridId = `${largeGridId}-${gridPolygonCellFeature.extraId}`;
				const boundaryBoxMed = this.geoSpatialService.computeBBox(gridPolygonCellFeature);
				const mediumBoundaryBoxPolygon = this.geoSpatialService.bBoxPolygon(boundaryBoxMed);
				if (this.geoSpatialService.isPolygonInExtent(boundingBoxPolygon, mediumBoundaryBoxPolygon)) {
					mediumGridData.push({
						boundaryBoxMed,
						gridPolygonCellFeature,
						medGridId
					});
				}
			}
		}
		return mediumGridData;
	}

	private getSmallGridFromLargeGrid(
		mediumGridData: TMediumGridInfo[],
		boundingBoxPolygon: TGeoJSONFeature<GeoJSONPolygon>
	) {
		const smallGridData: TSmallGridInfo[] = [];
		const options: TGeoOptions = { units: 'kilometers' };
		const GridLevelCellSideSmall = 0.499999;

		for (const mediumGridItem of mediumGridData) {
			const scaledSquareGridSmall = this.geoSpatialService.squareGrid(
				mediumGridItem.boundaryBoxMed,
				GridLevelCellSideSmall,
				options
			);
			if (!scaledSquareGridSmall.features.length) {
				return;
			}
			const arrangedScaledSquareGridSmall = this.reArrangeToGridWithExcelLabels(
				scaledSquareGridSmall.features,
				10,
				10,
				EGridLevel.small
			);
			for (const smallGridPolygonCell of arrangedScaledSquareGridSmall) {
				const smallGridId = `${mediumGridItem.medGridId}-${smallGridPolygonCell.extraId}`;
				const bBoxSmall = this.geoSpatialService.computeBBox(smallGridPolygonCell);
				const smallBoundingBoxPolygon = this.geoSpatialService.bBoxPolygon(bBoxSmall);

				if (this.geoSpatialService.isPolygonInExtent(boundingBoxPolygon, smallBoundingBoxPolygon)) {
					smallGridData.push({
						bBoxSmall,
						smallGridPolygonCell,
						smallGridId
					});
				}
			}
		}
		return smallGridData;
	}

	private generateExcelColumnIdentifiers() {
		const columns: string[] = [];
		const totalAlphabets = 26;

		for (let i = 0; i < totalAlphabets; i++) {
			columns.push(String.fromCharCode('A'.charCodeAt(0) + i));
		}

		for (let i = 0; i < totalAlphabets; i++) {
			for (let j = 0; j < totalAlphabets; j++) {
				columns.push(String.fromCharCode('A'.charCodeAt(0) + i) + String.fromCharCode('A'.charCodeAt(0) + j));
			}
		}

		return columns;
	}

	private reArrangeToGridWithExcelLabels(
		arr: TGeoJSONFeature[],
		numRows = 10,
		numCols = 10,
		gridLevel = EGridLevel.large
	) {
		const rearrangedArray: TExtendedGeoJSONFeature[] = [];
		const excelColumnLabels = this.generateExcelColumnIdentifiers();

		let cnt = 0;
		for (let i = numRows; i > 0; i--) {
			cnt++;
			for (let j = 0; j < numCols; j++) {
				const index = j * numRows + i;
				const grid = arr[index - 1];
				let extraId = '';
				if (gridLevel === 'large') {
					extraId = `${(cnt - 1).toString().padStart(2, '0')}${excelColumnLabels[j]
						.toString()
						.padStart(2, '0')}`;
				} else {
					extraId = `${cnt - 1}${excelColumnLabels[j]}`;
				}
				rearrangedArray.push({
					...grid,
					extraId
				});
			}
		}
		return rearrangedArray;
	}
}
