import { MapZoomInCommand, MarkersInBound } from '@searchResult/commands/mapZoom.command';
import { ListingSrResponse, LocationSearchResultResponse, SrFilter } from '@searchResult/types/types';
import { ListingSrPageResponse, Listing } from '@searchResult/types/listingSrResponse';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import { MapGridService } from '@shared/services/mapGridService';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { ISrCacheService } from '@shared/interfaces/srCacheService';
import { ListingSrService } from '@listingSr/core/services/listingSrService';
import { IMapInteractionService } from '@shared/interfaces/mapInteractionInterface';
import { MapMapper } from '@searchResult/mappers/map.mappers';
import { EAnalyticsEventCategory } from '@shared/types/matomo';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { IGeoSpatialService } from '@shared/interfaces/geoSpatialService';
import { BoundingBoxService } from '@shared/services/boundingBoxService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { ListingSrCacheService } from '@searchResult/services/listingSrCache.service';

export class MapZoomInUseCase {
	private hasFiredSatelliteViewEvent: boolean = false;
	private mapGridService: MapGridService;

	private filters: SrFilter;
	private srMapInstance: IMapInteractionService;
	private fromModuleType: EModuleType;
	private deviceType: EAccessDeviceType;
	private listingSrResponse: ListingSrPageResponse;
	private isFirstMapMove: boolean;
	private zoom: number;
	private boundingBox: any;
	private latestFilters: SrFilter;
	private markersInBound?: MarkersInBound;
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

	public async execute(command: MapZoomInCommand): Promise<LocationSearchResultResponse> {
		try {
			this.initializeProperties(command);
			this.setupMapAndBoundingBox();
			this.latestFilters = this.createLatestFilters();
			this.trackAnalytics();
			this.url = this.generateUrl();

			const response = await this.fetchListingSrResponse();

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

	private initializeProperties(command: MapZoomInCommand): void {
		this.filters = command.filters;
		this.srMapInstance = command.srMapInstance;
		this.fromModuleType = command.fromModuleType;
		this.deviceType = command.deviceType;
		this.listingSrResponse = command.listingSrResponse;
		this.isFirstMapMove = command.isFirstMapMove;
		this.zoom = command.zoom;
	}

	private setupMapAndBoundingBox(): void {
		this.removeDesktopOverlays();
		this.boundingBox = this.getBoundingBox();
		this.mapGridService = this.createMapGridService();
		this.markersInBound = this.getMarkersInBounds();
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

	private getMarkersInBounds(): MarkersInBound | undefined {
		if (!this.srMapInstance) return undefined;

		const isInBoundingBox = (pin: any) =>
			this.srMapInstance.isCoordinateInBoundingBox([pin.location.lon, pin.location.lat]);

		return {
			listingPinsInBound: this.listingSrResponse.pins.filter(isInBoundingBox),
			p360PinsInBound: this.listingSrResponse.p360Properties.data.filter(
				(pin) => pin.location && isInBoundingBox(pin)
			)
		};
	}

	private trackAnalytics(): void {
		this.trackSatelliteViewEvent();
		this.trackFirstTimeMapMove();
	}

	private trackSatelliteViewEvent(): void {
		if (this.zoom >= 18 && !this.hasFiredSatelliteViewEvent) {
			this.srAnalyticsService.trackMapLayerSwitchInteraction(
				this.getAnalyticsEventCategory(),
				'ClickMapSatelliteView'
			);
			this.hasFiredSatelliteViewEvent = true;
		}
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

	private getAnalyticsEventCategory(): EAnalyticsEventCategory {
		switch (this.fromModuleType) {
			case EModuleType.SCHOOL:
				return EAnalyticsEventCategory.SchoolCatchment;
			case EModuleType.PROJECT:
				return EAnalyticsEventCategory.NewDevelopments;
			default:
				return EAnalyticsEventCategory.Listings;
		}
	}

	private async fetchListingSrResponse(): Promise<ListingSrResponse> {
		return this.canUseExistingData() ? await this.useExistingData() : await this.fetchNewData();
	}

	private canUseExistingData(): boolean {
		if (!this.markersInBound) return false;
		const maxPins = this.filters.includeP360Properties ? 75 : this.listingSrCacheService.MAX_PINS;
		const totalPins = this.filters.includeP360Properties
			? this.listingSrResponse.p360Properties.total
			: this.listingSrResponse.pinsTotal;
		return totalPins < maxPins;
	}

	private async useExistingData(): Promise<ListingSrResponse> {
		if (!this.markersInBound?.listingPinsInBound || !this.markersInBound.p360PinsInBound) {
			return {
				success: true,
				data: this.listingSrResponse
			};
		}

		const updatedListings = await this.listingSrCacheService.getUpdatedListingsFullData(
			this.markersInBound.listingPinsInBound,
			this.listingSrResponse.listings,
			this.filters,
			this.deviceType
		);

		return {
			success: true,
			data: {
				...this.listingSrResponse,
				pins: this.markersInBound.listingPinsInBound,
				listings: updatedListings as unknown as Listing[],
				p360Properties: {
					total: this.markersInBound.listingPinsInBound.length,
					data: this.markersInBound.p360PinsInBound
				},
				filterTotal: this.markersInBound.listingPinsInBound.length,
				pinsTotal: this.markersInBound.listingPinsInBound.length
			}
		};
	}

	private async fetchNewData(): Promise<ListingSrResponse> {
		const gridResult = await this.mapGridService.getGrids();
		const bodyParams = MapMapper.toMapApiBody(this.latestFilters, gridResult, this.fromModuleType);
		const response = await this.listingSrRepository.getListingsByGridIds(bodyParams);

		return await this.listingSrCacheService.processListingSrResponse({
			response,
			filters: this.latestFilters,
			deviceType: this.deviceType
		});
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
