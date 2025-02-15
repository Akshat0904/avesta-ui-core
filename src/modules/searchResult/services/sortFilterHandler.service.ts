import { RecentSearchService } from '@searchResult/services/recentSearch.service';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { SortFilterMapper } from '@searchResult/mappers/sortFilter.mapper';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';
import { recentSearchQuery } from '@searchResult/useCases/filters/applyFilters.types';
import { TListingSrLocations } from '@shared/types/types';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { BoundingBoxService } from '@shared/services/boundingBoxService';
import { IGeoSpatialService } from '@shared/interfaces/geoSpatialService';
import { MapGridService } from '@shared/services/mapGridService';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { getRecentSearchesTab, getSelectedLocationNameFromResponse } from '@searchResult/shared/utils';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { LocationMapper } from '@searchResult/mappers/location.mapper';
import { EAccessDeviceType, EToastMsg } from '@shared/types/enums';
import { SortFilterCommand } from '@searchResult/commands/sortFilter.command';
import { IListingSrData, ILocation, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { EModuleType } from '@searchResult/types/enums';

export class SortFilterHandler {
	constructor(
		private listingSrRepository: ListingSrRepository,
		private recentSearchService: RecentSearchService,
		private recentlyViewService: RecentlyViewService,
		private toasterService: IToasterService,
		private boundingBoxService: BoundingBoxService,
		private geoSpatialService: IGeoSpatialService,
		protected srAnalyticsService: SrAnalyticsService
	) {}

	protected async handle(command: SortFilterCommand) {
		const { filters, fromModuleType, pageNo, srMapInstance, deviceType, selectedLocations, listingSrResponse } =
			command;

		const mapGridService = new MapGridService(srMapInstance, this.geoSpatialService, this.boundingBoxService);

		const formattedBoundingBox = mapGridService.formatBoundingBox(this.boundingBoxService.getBoundingBox());

		const locations = selectedLocations && LocationMapper.toLocations(selectedLocations);

		const latestFilters = SortFilterMapper.toUrlBody(filters, formattedBoundingBox, pageNo);

		const urlService = UrlServiceFactory.getUrlStrategy(fromModuleType);

		const url = urlService?.getUrlFromSrData(latestFilters);

		const analyticsLocations = SortFilterMapper.toAnalyticsLocation(
			listingSrResponse?.locationESRecords,
			listingSrResponse?.streetESRecords
		);

		this.trackFilterSearchInteractionEvent(filters, analyticsLocations);

		if (url) {
			if (this.isCheckLocationsInUrlData(filters)) {
				try {
					const body = ListingSrMapper.toApiRequest(filters, locations ? locations : filters.locations!);

					const response = await this.listingSrRepository.getSearchResultsByLocation(body);

					this.trackPageViewEvents(deviceType!, body, response.data, url);

					this.addToRecentSearch({
						latestFilters,
						response: response,
						url,
						fromModuleType,
						filters
					});

					const recentlyViewedAddedResponse = this.recentlyViewService.handleRecentlyViewedUpdates(response);

					return ListingSrMapper.toPresentation({
						response: recentlyViewedAddedResponse,
						filters: latestFilters,
						url,
						location: locations ? locations : filters.locations
					});
				} catch (error) {
					throw error;
				}
			} else {
				try {
					const gridResult = await mapGridService.getGrids();

					const bodyParams = SortFilterMapper.toMapApiBody(filters, gridResult, fromModuleType);

					const response = await this.listingSrRepository.getListingsByGridIds(bodyParams);

					const recentlyViewedAddedResponse = this.recentlyViewService.handleRecentlyViewedUpdates(response);

					this.trackPageViewEvents(deviceType!, filters, response.data, url);

					return ListingSrMapper.toPresentation({
						response: recentlyViewedAddedResponse,
						filters: latestFilters,
						url,
						location: locations
					});
				} catch (error) {
					this.toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
				}
			}
		} else {
			throw new Error('URL not generated from UrlService');
		}
	}

	private addToRecentSearch = (query: recentSearchQuery) => {
		const { latestFilters, response, url, fromModuleType, filters } = query;

		if (fromModuleType === EModuleType.PROJECT) {
			return;
		}

		const displayTexts = getSelectedLocationNameFromResponse(response.data);

		if (latestFilters.locations?.length && latestFilters.locations.length > 0) {
			const data = {
				displayName: displayTexts,
				pageUrl: url,
				filters: { pageType: filters.pageType, ...latestFilters },
				locations: latestFilters.locations
			};
			this.recentSearchService.addLocationToRecentSearches(
				getRecentSearchesTab(latestFilters.saleMethod[0]),
				data
			);
		}
	};

	private isCheckLocationsInUrlData = (urlData: TListingSrLocations) => {
		if (urlData.locations && urlData.locations.length > 0) {
			return true;
		}
		return false;
	};

	protected trackFilterSearchInteractionEvent(
		filters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		location: ILocation[]
	) {
		this.srAnalyticsService.trackFilterSearchInteraction(filters, filters.sort ? location : filters.locations!, '');
	}

	protected trackPageViewEvents(
		deviceType: EAccessDeviceType,
		aFilters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		listingSrResponse: ListingSrPageResponse,
		url: string
	) {
		try {
			this.srAnalyticsService.processPageViewEvents(deviceType, aFilters, listingSrResponse, url);
		} catch (error) {
			console.error('Tracking failed:', error);
		}
	}
}
