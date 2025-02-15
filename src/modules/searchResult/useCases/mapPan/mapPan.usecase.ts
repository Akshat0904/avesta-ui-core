import { MapPanUseCaseCommand } from '@searchResult/commands/mapPan.command';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';
import { MapMapper } from '@searchResult/mappers/map.mappers';
import { ListingSrCacheService } from '@searchResult/services/listingSrCache.service';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { IGeoSpatialService } from '@shared/interfaces/geoSpatialService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { BoundingBoxService } from '@shared/services/boundingBoxService';
import { MapGridService } from '@shared/services/mapGridService';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { EToastMsg } from '@shared/types/enums';

/**
 * Handles map panning operations and updates the search results accordingly
 */
export class MapPanUseCase {
	constructor(
		private srAnalyticsService: SrAnalyticsService,
		private geoSpatialService: IGeoSpatialService,
		private boundingBoxService: BoundingBoxService,
		private toasterService: IToasterService,
		private listingSrRepository: ListingSrRepository,
		private recentlyViewService: RecentlyViewService,
		private listingSrCacheService: ListingSrCacheService
	) {}

	/**
	 * Updates the search results based on the new map position
	 * @param command The map pan command containing new position details
	 * @returns Updated search results for the new map position
	 */
	public async execute(command: MapPanUseCaseCommand) {
		const { filters, srMapInstance, fromModuleType, deviceType, firstMapMove } = command;

		if (!srMapInstance) {
			console.error('Map instance is not yet defined');
			return;
		}

		const boundingBox = srMapInstance.getMapBoundingBox();
		this.boundingBoxService.setBoundingBox(boundingBox);
		const mapGridService = new MapGridService(srMapInstance, this.geoSpatialService, this.boundingBoxService);

		const formattedBoundingBox = mapGridService.formatBoundingBox(boundingBox);

		const latestFilters = MapMapper.toUrlBody(filters, formattedBoundingBox);
		const urlService = UrlServiceFactory.getUrlStrategy(fromModuleType);

		const url = urlService?.getUrlFromSrData(latestFilters);

		if (!url) {
			throw new Error('URL not generated from UrlService');
		}

		try {
			const gridResult = await mapGridService.getGrids();

			const bodyParams = MapMapper.toMapApiBody(latestFilters, gridResult, fromModuleType);

			const response = await this.listingSrRepository.getListingsByGridIds(bodyParams);

			// this.srAnalyticsService.processPageViewEvents(deviceType, latestFilters, response.data, url);

			const processedResponse = await this.listingSrCacheService.processListingSrResponse({
				response,
				filters: latestFilters,
				deviceType,
				url
			});

			const recentlyViewedAddedResponse = this.recentlyViewService.handleRecentlyViewedUpdates(processedResponse);
			if (!firstMapMove) {
				this.srAnalyticsService.trackFirstTimeMapMoveInteraction(
					filters,
					response.data.locationESRecords,
					response.data.streetESRecords
				);
			}

			this.srAnalyticsService.trackSearchResultsAnalytics(
				deviceType,
				latestFilters,
				recentlyViewedAddedResponse.data
			);
			return ListingSrMapper.toPresentation({
				response: recentlyViewedAddedResponse,
				filters: latestFilters,
				url,
				location: latestFilters.locations
			});
		} catch (error) {
			this.toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
		}
	}
}
