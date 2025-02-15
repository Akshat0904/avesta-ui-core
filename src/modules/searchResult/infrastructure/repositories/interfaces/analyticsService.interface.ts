import { TSrPageScreen } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { EPropertyImageSource } from '@searchResult/types/enums';
import {
	AgentBanner,
	Listing,
	ListingSrPageResponse,
	LocalExpertAgency,
	LocalExpertListing,
	LocationRecord,
	PinListing,
	PinP360,
	SchoolInfoEsRes,
	StreetRecord
} from '@searchResult/types/listingSrResponse';
import { EAccessDeviceType } from '@shared/types/enums';
import { TSeoLinksDimensions } from '@shared/types/matomo';

export interface SrAnalyticsService {
	trackAgentBannerInteraction(agentBanner: AgentBanner, eventAction: string, location: ILocation): void;

	trackLocalExpertInteraction(localExpert: LocalExpertAgency, eventAction: string, location: ILocation): void;

	trackLocalExpertListing(eventAction: string, listing: LocalExpertListing): void;

	processPageViewEvents(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: ListingSrPageResponse,
		url?: string
	): void;

	trackDrawerInteraction(
		appliedFilters: IListingSrData,
		locationRecords: LocationRecord[] | undefined,
		streetRecords: StreetRecord[] | undefined
	): void;

	trackBackToMapButtonInteraction(
		appliedFilters: IListingSrData,
		locationRecords: LocationRecord[] | undefined,
		streetRecords: StreetRecord[] | undefined
	): void;

	trackSeoLinkInteraction(eventAction: string, seoLinkDetail: TSeoLinksDimensions): void;

	trackFirstTimeMapMoveInteraction(
		appliedFilters: IListingSrData,
		locationRecords: LocationRecord[] | undefined,
		streetRecords: StreetRecord[] | undefined
	): void;

	trackSeeAllButtonInteraction(
		appliedFilters: IListingSrData,
		locationRecords: LocationRecord[] | undefined,
		streetRecords: StreetRecord[] | undefined
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
		locationRecords: LocationRecord[] | undefined,
		streetRecords: StreetRecord[] | undefined,
		emailFrequency: string
	): void;

	trackMapLayerSwitchInteraction(eventCategory: string, eventAction: string): void;

	trackListingDetailInteraction(listing: PinListing | Listing, eventAction: string): void;

	trackPaginationInteraction(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listings: Listing[],
		location: ILocation[],
		url?: string
	): void;

	trackPropertyViewInteraction(property: PinP360, imageSource: EPropertyImageSource): void;

	trackClusterMarkerInteraction(
		appliedFilters: IListingSrData,
		locationRecords: LocationRecord[] | undefined,
		streetRecords: StreetRecord[] | undefined
	): void;

	trackSchoolCardInteraction(schoolInfo: SchoolInfoEsRes): void;

	trackSearchResultsAnalytics(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: ListingSrPageResponse,
		screen?: TSrPageScreen
	): void;
}
