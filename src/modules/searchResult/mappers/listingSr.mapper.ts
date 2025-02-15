import { ESchoolCatchmentSrPageType, IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { LocationSearchResultResponse, presentationQuery, SrFilter } from '@searchResult/types/types';
import { removeObjectKeys } from '@shared/utils/utils';

export class ListingSrMapper {
	static toApiRequest(filters: SrFilter, locations: ILocation[]): IListingSrData {
		const urlData = removeObjectKeys(filters, ['pageType', 'zoom', 'size']);

		return {
			...urlData,
			page: 1,
			locations,
			...(filters.pageType === ESchoolCatchmentSrPageType.project && { onlyProject: true })
		};
	}

	static toPresentation(presentationQuery: presentationQuery): LocationSearchResultResponse {
		const { filters, response, url, fromModuleType, location } = presentationQuery;
		return {
			response,
			filters: {
				...filters,
				locations: location
			},
			url,
			fromModuleType
		};
	}

	static toSchoolApiRequest(apiBody: any) {
		const optimizedAppliedFilters = removeObjectKeys(apiBody, ['pageType']);

		return {
			...optimizedAppliedFilters,
			page: 1
		};
	}

	static toHandlerFilter(appliedFilters: SrFilter) {
		return removeObjectKeys(appliedFilters, [
			'bottomRightLatitude',
			'bottomRightLongitude',
			'topLeftLongitude',
			'topLeftLatitude'
		]);
	}
}
