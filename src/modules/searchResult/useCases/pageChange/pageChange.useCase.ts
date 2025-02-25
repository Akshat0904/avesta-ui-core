import { IListingSrRepository } from '@listingSr/core/interfaces/listingSrRepository';
import { ISrAnalyticsService } from '@listingSr/core/interfaces/srAnalyticsService';
import { TListing } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ILocation, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { PageChangeUsecaseCommand } from '@searchResult/commands/pageChange.command';
import { PageChangeMapper } from '@searchResult/mappers/pageChange.mapper';
import { EModuleType } from '@searchResult/types/enums';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { EAccessDeviceType } from '@shared/types/enums';

export class PageChangeUseCase {
	constructor(
		private listingSrRepository: IListingSrRepository,
		private srAnalyticsService: ISrAnalyticsService,
		private toasterService: IToasterService
	) {}
	async execute(command: PageChangeUsecaseCommand) {
		const { pageNumber, listingSrResponse, appliedFilters, deviceType, isFrom } = command;
		const { size, pins } = listingSrResponse;
		const filters = {
			...appliedFilters,
			page: pageNumber
		};
		const currentPagePins = PageChangeMapper.getPinsForPage(pageNumber, size, pins);

		if (currentPagePins && currentPagePins.length) {
			const listingQuery = PageChangeMapper.getListingQuery(currentPagePins, appliedFilters);

			const url = this.getUrlFromListingSrData(isFrom, filters);

			try {
				const response = await this.listingSrRepository.getListingsByIds(listingQuery);

				const location = PageChangeMapper.getLocationFromAppliedFilters(filters);

				this.trakePaginationEvent(deviceType, filters, response.data, location, url || '');

				const listings = PageChangeMapper.applyFiltersToListings(response.data, filters);
				return {
					filters,
					listings,
					url
				};
			} catch (error: any) {
				this.toasterService.customToaster(error.message, 'error');
			}
		}
	}

	private getUrlFromListingSrData(isFrom: EModuleType, filters: IListingSrData & ISchoolCatchmentSrUrlFromData) {
		const { zoom, pageType, ...restFilters } = filters;
		const url = UrlServiceFactory.getUrlStrategy(isFrom);
		return url?.getUrlFromSrData(restFilters);
	}

	private trakePaginationEvent(
		deviceType: EAccessDeviceType,
		filters: IListingSrData,
		data: TListing[],
		location: ILocation[],
		url?: string
	) {
		try {
			this.srAnalyticsService.trackPaginationInteraction(deviceType, filters, data, location, url);
		} catch (error) {
			console.error('Tracking failed:', error);
		}
	}
}
