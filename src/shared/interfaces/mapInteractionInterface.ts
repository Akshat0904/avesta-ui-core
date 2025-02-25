import { TMapVectorLayerConfig, TMarkerData, TMarkerSourceType, TUpdateTileConfig } from '@shared/types/types';
import { TLargeGridData } from '@listingSr/core/types/listingSrTypes';
import { EFitMapToMarkers } from '../types/enums';

export interface IMapInteractionService {
	getMapBoundingBox(): number[];
	getFeaturesInBoundingBox(bBox: number[], sourceName: string): Promise<TLargeGridData[]>;
	convertLonLatBoundaryBoxToMapCoords(boundBoxes: number[]): number[];
	addSwitchingTileLayerSet(): void;
	addVectorLayer(aVectorLayerConfig: TMapVectorLayerConfig): void;
	fitMapToBounds(bounds: [number, number][]): Promise<EFitMapToMarkers>;
	fitMapToMarkers(bounds?: number[] | null, animate?: boolean): Promise<EFitMapToMarkers>;
	getCurrentZoomLevel(): number | undefined;
	updateTileLayer(tileLayerName: string, aLayerConfig: TUpdateTileConfig): void;
	setBaseTileLayerVisibility(baseTileLayerName: 'BASE_TILE_LAYER_1' | 'BASE_TILE_LAYER_2', visibility: boolean): void;
	addOverlaysToolTip(identifier: string, position: number[]): void;
	removeOverlaysToolTip(identifier: string): void;
	getMarkersCoordinates(event: any): number[];
	addMarkers(markers: TMarkerData[], sourceName: Exclude<TMarkerSourceType, undefined>, zIndex?: number): void;
	isCoordinateInBoundingBox(coord: number[]): boolean;
	getFeatureById(sourceName: TMarkerSourceType, featureId: number | string): any;
	setStyleToFeature(feature: any, style: any): void;
	addCircle(circleCenter: number[], radius: number, fillColor: string, strokeColor: string): void;
	removeCircle(): void;
	removeMarkersFromSourceName(sourceName: Exclude<TMarkerSourceType, undefined>): void;
}
