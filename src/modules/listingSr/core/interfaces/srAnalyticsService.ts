import { IListingSrData, ILocation } from '@realestateview/avesta-js-core/dist/services/urlService/types';
import { EAccessDeviceType, EPropertyImageSource } from '@shared/types/enums';
import { TSeoLinksDimensions } from '@shared/types/matomo';
import {
	ISchoolInfoEsRes,
	TAgentBanner,
	TListing,
	TListingSrPageResponse,
	TLocalExpertAgency,
	TLocalExpertListing,
	TLocationRecord,
	TPinListing,
	TPinP360,
	TSrPageScreen,
	TStreetRecord
} from '../types/listingSrTypes';

export interface ISrAnalyticsService {
	trackAgentBannerInteraction(agentBanner: TAgentBanner, eventAction: string, location: ILocation): void;

	trackLocalExpertInteraction(localExpert: TLocalExpertAgency, eventAction: string, location: ILocation): void;

	trackLocalExpertListing(eventAction: string, listing: TLocalExpertListing): void;

	processPageViewEvents(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: TListingSrPageResponse,
		url?: string
	): void;

	trackDrawerInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	): void;

	trackBackToMapButtonInteraction(
		appliedFilters: IListingSrData,
		actionName: string,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	): void;

	trackSearchResultsAnalytics(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: TListingSrPageResponse
	): void;

	trackSeoLinkInteraction(eventAction: string, seoLinkDetail: TSeoLinksDimensions): void;

	trackFirstTimeMapMoveInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	): void;

	trackSeeAllButtonInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	): void;

	trackFilterSearchInteraction(
		appliedFilters: IListingSrData,
		location: ILocation[],
		searchKeyword: string,
		gnafId?: string
	): void;

	trackBreadcrumbInteraction(appliedFilters: IListingSrData | undefined): void;

	trackSaveSearchInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined,
		emailFrequency: string
	): void;

	trackMapLayerSwitchInteraction(eventCategory: string, eventAction: string): void;

	trackListingDetailInteraction(listing: TPinListing | TListing, eventAction: string): void;

	trackPaginationInteraction(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listings: TListing[],
		location: ILocation[],
		url?: string
	): void;

	trackPropertyViewInteraction(property: TPinP360, imageSource: EPropertyImageSource): void;

	trackClusterMarkerInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	): void;

	trackSchoolCardInteraction(schoolInfo: ISchoolInfoEsRes): void;

	trackMapPageView(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: TListingSrPageResponse,
		url?: string
	): void;
}
