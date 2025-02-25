import { MapZoomOutCommand } from '@searchResult/commands/mapZoom.command';
import { ListingSrResponse, LocationSearchResultResponse, SrFilter } from '@searchResult/types/types';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import { MapGridService } from '@shared/services/mapGridService';
import { ISrCacheService } from '@shared/interfaces/srCacheService';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { MapMapper } from '@searchResult/mappers/map.mappers';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { IGeoSpatialService } from '@shared/interfaces/geoSpatialService';
import { BoundingBoxService } from '@shared/services/boundingBoxService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';
import { IMapInteractionService } from '@shared/interfaces/mapInteractionInterface';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { ListingSrCacheService } from '@searchResult/services/listingSrCache.service';

export class MapZoomOutUseCase {
	private mapGridService: MapGridService;

	private filters: SrFilter;
	private fromModuleType: EModuleType;
	private isFirstMapMove: boolean;
	private listingSrResponse: ListingSrPageResponse;
	private deviceType: EAccessDeviceType;
	private srMapInstance: IMapInteractionService;
	private zoom: number;
	private boundingBox: any;
	private latestFilters: SrFilter;
	private url: string;

	constructor(
		private readonly srAnalyticsService: SrAnalyticsService,
		private readonly geoSpatialService: IGeoSpatialService,
		private readonly boundingBoxService: BoundingBoxService,
		private readonly toasterService: IToasterService,
		private readonly listingSrRepository: ListingSrRepository,
		private readonly recentlyViewService: RecentlyViewService,
		private readonly listingSrCacheService: ListingSrCacheService
	) {}

	public async execute(command: MapZoomOutCommand): Promise<LocationSearchResultResponse> {
		try {
			this.initializeProperties(command);
			this.setupMapAndBoundingBox();
			this.latestFilters = this.createLatestFilters();
			this.trackFirstTimeMapMove();
			this.listingSrCacheService.clear();
			this.url = this.generateUrl();

			const response = await this.fetchNewData();

			const recentlyViewedAddedResponse = this.recentlyViewService.handleRecentlyViewedUpdates(response);

			this.srAnalyticsService.trackSearchResultsAnalytics(
				this.deviceType,
				this.filters,
				recentlyViewedAddedResponse.data
			);

			return ListingSrMapper.toPresentation({
				response: recentlyViewedAddedResponse,
				filters: this.latestFilters,
				url: this.url
			});
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	}

	private initializeProperties(command: MapZoomOutCommand): void {
		this.filters = command.filters;
		this.fromModuleType = command.fromModuleType;
		this.isFirstMapMove = command.isFirstMapMove;
		this.listingSrResponse = command.listingSrResponse;
		this.deviceType = command.deviceType;
		this.srMapInstance = command.srMapInstance;
		this.zoom = command.zoom;
	}

	private setupMapAndBoundingBox(): void {
		this.removeDesktopOverlays();
		this.boundingBox = this.getBoundingBox();
		this.mapGridService = this.createMapGridService();
	}

	private removeDesktopOverlays(): void {
		if (this.deviceType === EAccessDeviceType.Desktop) {
			this.srMapInstance.removeOverlaysToolTip('overlay-popup');
		}
	}

	private getBoundingBox(): any {
		const boundingBox = this.srMapInstance.getMapBoundingBox();
		this.boundingBoxService.setBoundingBox(boundingBox);
		return boundingBox;
	}

	private createMapGridService(): MapGridService {
		return new MapGridService(this.srMapInstance, this.geoSpatialService, this.boundingBoxService);
	}

	private createLatestFilters(): SrFilter {
		const formattedBoundingBox = this.mapGridService.formatBoundingBox(this.boundingBox);
		return MapMapper.toUrlBody({ ...this.filters, zoom: this.zoom }, formattedBoundingBox);
	}

	private trackFirstTimeMapMove(): void {
		if (!this.isFirstMapMove) {
			this.srAnalyticsService.trackFirstTimeMapMoveInteraction(
				this.filters,
				this.listingSrResponse.locationESRecords,
				this.listingSrResponse.streetESRecords
			);
		}
	}

	private async fetchNewData(): Promise<ListingSrResponse> {
		const gridResult = await this.mapGridService.getGrids();
		const bodyParams = MapMapper.toMapApiBody(this.latestFilters, gridResult, this.fromModuleType);
		return await this.listingSrRepository.getListingsByGridIds(bodyParams);
	}

	private generateUrl(): string {
		const urlService = UrlServiceFactory.getUrlStrategy(this.fromModuleType);
		const url = urlService?.getUrlFromSrData(this.latestFilters);

		if (!url) {
			throw new Error('URL not generated from UrlService');
		}

		return url;
	}

	private handleError(error: any): void {
		this.toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
	}
}
