import {
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import { BoundingBox, GridResult } from '@searchResult/types/types';
import { UrlMapper } from './url.mapper';
import { EModuleType } from '@searchResult/types/enums';
import { removeObjectKeys } from '@shared/utils/utils';

export class MapMapper {
	static toUrlBody(
		filters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		formatBoundingBox?: BoundingBox,
		pageNo?: number
	) {
		const filtersWithLatLng = {
			...filters,
			...(filters.includeP360Properties && { includeP360Properties: filters.includeP360Properties }),
			...(filters.zoom && { zoom: filters.zoom }),
			...(formatBoundingBox && { ...formatBoundingBox }),
			locations: [],
			page: pageNo || 1
		};

		const body = UrlMapper.toAppliedFilterUrlData(filtersWithLatLng);

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
			...((fromModuleType === EModuleType.PROJECT || filters.pageType === ESchoolCatchmentSrPageType.project) && {
				onlyProject: true
			})
		};
	}
}
