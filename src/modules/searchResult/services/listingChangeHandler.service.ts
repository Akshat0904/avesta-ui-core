import { LocationChangeHandlerCommand } from '@searchResult/commands/locationChange.command';
import { LocationChangeHandler } from '@searchResult/infrastructure/repositories/interfaces/locationChange.interface';
import { LocationMapper } from '@searchResult/mappers/location.mapper';
import { LocationSearchResultResponse, SrFilter } from '@searchResult/types/types';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { RecentSearchService } from '@searchResult/services/recentSearch.service';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';
import { EAccessDeviceType, EAppsPageType, EModuleType } from '@shared/types/enums';
import {
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import { AnalyticsManagerService } from '@shared/services/analyticsManagerService';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { getRecentSearchesTab, getSelectedLocationNameFromResponse } from '@searchResult/shared/utils';

export class ListingChangeHandler implements LocationChangeHandler {
	constructor(
		private srAnalyticsService: SrAnalyticsService,
		private listingSrRepository: ListingSrRepository,
		private recentSearchService: RecentSearchService,
		private analyticsManagerService: AnalyticsManagerService,
		private recentlyViewService: RecentlyViewService
	) {}
	async handle(command: LocationChangeHandlerCommand): Promise<LocationSearchResultResponse | void> {
		const { selectedLocations, appliedFilters, fromModuleType, searchKeyword, deviceType } = command;

		const appsPageType = this.getAppsPageType(fromModuleType!, appliedFilters);

		this.analyticsManagerService.set(appsPageType);

		const locations = LocationMapper.toLocations(selectedLocations);

		this.srAnalyticsService.trackFilterSearchInteraction(appliedFilters, locations, searchKeyword);

		const apiBodyParams = ListingSrMapper.toApiRequest(appliedFilters, locations);

		const currentModuleType = this.getCurrentModuleType(appliedFilters, fromModuleType!);

		const urlService = UrlServiceFactory.getUrlStrategy(currentModuleType!);

		const url = urlService?.getUrlFromSrData(apiBodyParams);

		if (url) {
			try {
				const searchResult = await this.listingSrRepository.getSearchResultsByLocation(apiBodyParams);

				this.trackPageViewInteraction(deviceType!, apiBodyParams, searchResult.data, url);

				const displayTexts = getSelectedLocationNameFromResponse(searchResult.data);

				const data = {
					displayName: displayTexts,
					pageUrl: url,
					filters: apiBodyParams,
					locations
				};

				appsPageType !== EAppsPageType.NewDevSr &&
					this.recentSearchService.addLocationToRecentSearches(
						getRecentSearchesTab(apiBodyParams.saleMethod[0]),
						data
					);

				const recentlyViewUpdateResponse = this.recentlyViewService.handleRecentlyViewedUpdates(searchResult);

				return ListingSrMapper.toPresentation({
					response: recentlyViewUpdateResponse,
					filters: appliedFilters,
					url: url,
					fromModuleType: currentModuleType,
					location: locations
				});
			} catch (error) {
				throw error;
			}
		} else {
			throw new Error('URL not generated from UrlService');
		}
	}

	private getCurrentModuleType(appliedFilters: SrFilter, fromModuleType: EModuleType) {
		return appliedFilters.pageType === ESchoolCatchmentSrPageType.project || fromModuleType === EModuleType.PROJECT
			? EModuleType.PROJECT
			: EModuleType.HOME;
	}

	private getAppsPageType(fromModuleType: EModuleType, appliedFilters: SrFilter) {
		return appliedFilters.pageType === ESchoolCatchmentSrPageType.project || fromModuleType === EModuleType.PROJECT
			? EAppsPageType.NewDevSr
			: EAppsPageType.ListingSr;
	}

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
