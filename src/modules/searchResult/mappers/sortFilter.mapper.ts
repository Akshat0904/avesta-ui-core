import {
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ILocation,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import { UrlMapper } from '@searchResult/mappers/url.mapper';
import { capitalizeEachWord } from '@searchResult/shared/utils';
import { EModuleType } from '@searchResult/types/enums';
import { LocationRecord, StreetRecord } from '@searchResult/types/listingSrResponse';
import { BoundingBox, GridResult } from '@searchResult/types/types';
import { removeObjectKeys } from '@shared/utils/utils';

export class SortFilterMapper {
	static toUrlBody(
		filters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		formatBoundingBox?: BoundingBox,
		pageNo?: number
	) {
		const latestFilters = {
			...filters,
			...(filters.includeP360Properties && { includeP360Properties: filters.includeP360Properties }),
			...(filters.zoom && { zoom: filters.zoom }),
			...(!filters.locations && formatBoundingBox && { ...formatBoundingBox }),
			page: pageNo || 1,
			topLeftLongitude: filters.topLeftLongitude,
			topLeftLatitude: filters.topLeftLatitude,
			bottomRightLongitude: filters.bottomRightLongitude,
			bottomRightLatitude: filters.bottomRightLatitude
		};

		const body = UrlMapper.toAppliedFilterUrlData(latestFilters);

		return {
			...body,
			...(filters.pageType !== ESchoolCatchmentSrPageType.listing && {
				pageType: filters.pageType
			})
		};
	}

	static toMapApiBody(
		filters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		gridResult: GridResult | null,
		fromModuleType: EModuleType
	) {
		const filtersWithoutLocation = removeObjectKeys(filters, ['locations', 'pageType']);

		return {
			...filtersWithoutLocation,
			page: 1,
			...(gridResult && gridResult.gridIds && gridResult.gridIds.length > 0 && { gridIds: gridResult.gridIds }),
			...(gridResult && gridResult.gridLevel && { gridLevel: gridResult.gridLevel }),
			...((fromModuleType === EModuleType.PROJECT ||
				filtersWithoutLocation.pageType === ESchoolCatchmentSrPageType.project) && { onlyProject: true })
		};
	}

	static toAnalyticsLocation = (
		locationESRecords: LocationRecord[] | undefined,
		streetESRecords: StreetRecord[] | undefined
	): ILocation[] => {
		if (streetESRecords && streetESRecords.length > 0) {
			return this.getStreetData(streetESRecords);
		}

		if (locationESRecords && locationESRecords.length > 0) {
			return this.getLocationData(locationESRecords);
		}

		return [];
	};

	private static getLocationData(locationRecord: LocationRecord[]) {
		return locationRecord.map((location) => {
			return {
				state: location.state.toUpperCase(),
				city: capitalizeEachWord(location.city || ''),
				lgaName: capitalizeEachWord(location.lgaName || ''),
				suburbName: capitalizeEachWord(location.suburbName || ''),
				postcode: capitalizeEachWord(location.postcode || '')
			};
		});
	}

	private static getStreetData(streetRecord: StreetRecord[]) {
		return streetRecord.map((location) => {
			return {
				state: location.state.toUpperCase(),
				streetName: capitalizeEachWord(location.streetName),
				suburbName: capitalizeEachWord(location.suburbName),
				postcode: capitalizeEachWord(location.postcode)
			};
		});
	}
}
