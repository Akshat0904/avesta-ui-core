import {
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ISchoolCatchmentSrUrlFromData,
	UrlService
} from '@realestateview/avesta-js-core';
import { LocationChangeHandlerCommand } from '@searchResult/commands/locationChange.command';
import { LocationChangeHandler } from '@searchResult/infrastructure/repositories/interfaces/locationChange.interface';
import { LocationMapper } from '@searchResult/mappers/location.mapper';
import { LocationSearchResultResponse, SrFilter } from '@searchResult/types/types';
import { EAccessDeviceType, EAppsPageType, EModuleType } from '@shared/types/enums';
import { AnalyticsManagerService } from '@shared/services/analyticsManagerService';
import { TSelectedSearch } from '@shared/types/types';
import { UrlMapper } from '@searchResult/mappers/url.mapper';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { RecentSearchService } from '@searchResult/services/recentSearch.service';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { getRecentSearchesTab } from '@searchResult/shared/utils';

export class SchoolCatchmentChangeHandler implements LocationChangeHandler {
	constructor(
		private listingSrRepository: ListingSrRepository,
		private srAnalyticsService: SrAnalyticsService,
		private recentSearchService: RecentSearchService,
		private analyticsManagerService: AnalyticsManagerService,
		private recentlyViewService: RecentlyViewService
	) {}

	async handle(command: LocationChangeHandlerCommand): Promise<LocationSearchResultResponse | void> {
		this.analyticsManagerService.set(EAppsPageType.SchoolSr);

		const { selectedLocations, appliedFilters, fromModuleType, deviceType, searchKeyword } = command;

		const locations = LocationMapper.toLocations(selectedLocations);

		const urlData = this.toUrlParams({ appliedFilters, locations, fromModuleType });

		const url = UrlService.SchoolCatchmentSr.getUrlFromSchoolCatchmentSrData(urlData);

		this.srAnalyticsService.trackFilterSearchInteraction(appliedFilters, locations, searchKeyword);

		if (url) {
			try {
				const apiBodyParams = ListingSrMapper.toApiRequest(appliedFilters, locations);

				const searchResponse = await this.listingSrRepository.getSearchResultsByLocation(apiBodyParams);

				this.trackPageViewInteraction(deviceType!, apiBodyParams, searchResponse.data, url);

				this.recentSearchLocation(selectedLocations, url, appliedFilters, fromModuleType);

				const updateResponse = this.recentlyViewService.handleRecentlyViewedUpdates(searchResponse);

				return ListingSrMapper.toPresentation({
					response: updateResponse,
					filters: urlData,
					url: url,
					fromModuleType: EModuleType.SCHOOL,
					location: locations
				});
			} catch (error) {
				throw error;
			}
		} else {
			throw new Error('URL not generated from UrlService');
		}
	}

	private recentSearchLocation(
		selectedLocations: TSelectedSearch[],
		url: string,
		appliedFilters: SrFilter,
		fromModuleType: EModuleType | undefined
	) {
		if (fromModuleType === EModuleType.PROJECT) {
			return;
		}
		const selectedLocationDetails = selectedLocations;
		const locationDetails = selectedLocationDetails.map((location) => location && location.value);

		const data = {
			displayName: [selectedLocations[0].displayName],
			pageUrl: url,
			filters: appliedFilters,
			locations: locationDetails
		};

		this.recentSearchService.addLocationToRecentSearches(getRecentSearchesTab(appliedFilters.saleMethod[0]), data);
	}

	private toUrlParams({ appliedFilters, locations, fromModuleType }) {
		const updatedFilters = UrlMapper.toUrlData(appliedFilters);

		const pageType =
			fromModuleType === EModuleType.PROJECT ? ESchoolCatchmentSrPageType.project : updatedFilters.pageType;

		const body = {
			...updatedFilters,
			locations: locations,
			pageType
		};

		body.pageType === ESchoolCatchmentSrPageType.listing && delete body.pageType;

		return body;
	}

	// private async getSearchResult(apiRequest: any): Promise<ListingSrResponse> {
	// 	try {
	// 		const optimizedAppliedFilters = removeObjectKeys(apiRequest, ['pageType']);
	// 		return await this.listingSrRepository.getSearchResultsByLocation(optimizedAppliedFilters);
	// 	} catch (error) {
	// 		throw new Error('URL not generated from UrlService');
	// 	}
	// }

	private trackPageViewInteraction(
		deviceType: EAccessDeviceType,
		filters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		response: ListingSrPageResponse,
		url: string
	) {
		try {
			this.srAnalyticsService.processPageViewEvents(deviceType, filters, response, url);
		} catch (error) {
			console.error('Tracking failed:', error);
		}
	}
}
