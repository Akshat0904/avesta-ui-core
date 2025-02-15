import { EListingEntityType, IListingSrData, ILocation, UrlService } from '@realestateview/avesta-js-core';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import { EAccessDeviceType, EAppsPageType, EPropertyImageSource } from '@shared/types/enums';
import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	TSeoLinksDimensions
} from '@shared/types/matomo';
import { getUtmString } from '@shared/utils/utils';
import { ListingService } from '@shared/services/listingService';
import { IConfigService } from '@shared/interfaces/configService';
import { EntityTypeAnalyticsStrategyFactory } from '@shared/services/entityTypeAnalyticsStrategyFactory';
import { IEntityTypeAnalyticsStrategy } from '@shared/interfaces/entityTypeAnalyticsStrategy';
import { AnalyticsManagerService } from '@shared/services/analyticsManagerService';
import {
	TAgentBanner,
	TListing,
	TListingSrPageResponse,
	TLocalExpertAgency,
	TLocalExpertListing,
	TLocationRecord,
	TPinListing,
	TPinP360,
	TStreetRecord
} from '../../types/listingSrTypes';
import { ISrAnalyticsService } from '@listingSr/core/interfaces/srAnalyticsService';
import { SrViewService } from '@searchResult/services/srView.service';

export class SrAnalyticsService implements ISrAnalyticsService {
	constructor(
		private configService: IConfigService,
		private analyticsService: IAnalyticsService,
		private listingService: ListingService,
		private entityTypeAnalyticsStrategyFactory: EntityTypeAnalyticsStrategyFactory,
		private entityType: EListingEntityType,
		private analyticsManagerService: AnalyticsManagerService,
		private srViewService: SrViewService
	) {}

	getAppsPageType() {
		return this.analyticsManagerService.get();
	}

	private getAnalyticsStrategyFromConstructors() {
		const appsPageType = this.getAppsPageType();

		return this.entityTypeAnalyticsStrategyFactory.getStrategy(appsPageType, this.entityType);
	}

	getAppsPageTypeFromEntity(entityType: EListingEntityType) {
		if (entityType === EListingEntityType.project) {
			return EAppsPageType.NewDevSr;
		}
		return EAppsPageType.ListingSr;
	}

	private getAnalyticsStrategyFromData(aEntityType: EListingEntityType | undefined) {
		const entityType = aEntityType || EListingEntityType.listing;

		const appsPageType = this.getAppsPageTypeFromEntity(entityType);

		return this.entityTypeAnalyticsStrategyFactory.getStrategy(appsPageType, entityType);
	}

	private getEventCategory(entityType: IEntityTypeAnalyticsStrategy) {
		return entityType.getEventCategory();
	}

	private trackPageView(appliedFilters: IListingSrData, location: ILocation[], url?: string) {
		const entityType = this.getAnalyticsStrategyFromConstructors();

		const screen = this.srViewService.getSearchResultScreen();

		const utmString = url && getUtmString(url);

		const title = entityType.deriveUrlPathAndTitle(screen).title;

		const customUrl = `${this.configService.getAppConfig().domainUrl}/${
			entityType.deriveUrlPathAndTitle(screen).url
		}/${utmString && `?${utmString}`}`;

		return this.analyticsService.trackPageView(
			title,
			customUrl,
			entityType.getPageViewCommonDimensions(appliedFilters, location)
		);
	}

	private trackListings(listings: TListing[]) {
		listings.map((listing) => {
			const entityType = this.getAnalyticsStrategyFromData(listing.entityType);

			this.analyticsService.trackEvent(
				this.getEventCategory(entityType),
				'InSearchResult',
				'',
				'',
				EAnalyticsEventType.InSearchResult,
				entityType.getEventTrackingCommonDimensions(listing)
			);
		});
	}

	trackAgentBannerInteraction(agentBanner: TAgentBanner, eventAction: string, location: ILocation, url?: string) {
		const regex = /(.*\/\/)?(.+)\//;

		const agentWebLink = agentBanner.webLink.match(regex);

		this.analyticsService.trackEvent(
			'Agent',
			eventAction,
			'',
			'',
			EAnalyticsEventType.AgentBanner,
			{
				...(agentBanner.agencyId && { agencyId: agentBanner.agencyId }),
				state: location.state,
				city: location.city,
				lgaName: location.lgaName,
				suburb: location.suburbName,
				postCode: location.postcode,
				...(agentWebLink && {
					domainName: agentWebLink[2]
				}),
				...(agentBanner.isReipAgency && { isReipAgency: agentBanner.isReipAgency })
			},
			url
		);
	}

	private trackLocationProfileInteraction(location: ILocation, url?: string) {
		this.analyticsService.trackEvent(
			'LocationProfile',
			'InSearchResult',
			'',
			'',
			EAnalyticsEventType.LocationProfile,
			{
				state: location.state,
				city: location.city,
				lgaName: location.lgaName,
				suburb: location.suburbName,
				postCode: location.postcode
			},
			url
		);
	}

	trackLocalExpertInteraction(
		localExpert: TLocalExpertAgency,
		eventAction: string,
		location: ILocation,
		url?: string
	) {
		const agencyUrlData = UrlService.AgencyDetails.getAgencyDataFromUrl(localExpert.agencyProfileLink);

		this.analyticsService.trackEvent(
			'Agent',
			eventAction,
			'',
			'',
			EAnalyticsEventType.LocalExpert,
			{
				...(agencyUrlData && agencyUrlData.agencyId && { agencyId: agencyUrlData.agencyId }),
				state: location.state,
				city: location.city,
				lgaName: location.lgaName,
				suburb: location.suburbName,
				postCode: location.postcode,
				isReipAgency: localExpert.isReipAgency && Boolean(localExpert.isReipAgency)
			},
			url
		);
	}

	trackLocalExpertListing(eventAction: string, listing: TLocalExpertListing, url?: string) {
		this.analyticsService.trackEvent(
			'Listings',
			eventAction,
			'',
			'',
			EAnalyticsEventType.LocalExpertListing,
			{
				listingId_GnafId: listing.id.toString(),
				listingType: this.listingService.getListingTypeByStatus(listing.status, listing.saleMethod),
				tierType: listing.rank,
				...(listing.agencyId && { agencyId: listing.agencyId }),
				...(listing.agentId &&
					listing.agentId.length > 0 && {
						agentId: listing.agentId[0]
					}),
				state: listing.state,
				city: listing.city,
				lgaName: listing.lgaName,
				suburb: listing.suburbName,
				bedroom: listing.bedrooms,
				bathroom: listing.bathrooms,
				carpark: listing.carparks,
				propertyType: listing.primaryPropertyType,
				postCode: listing.postcode,
				street: listing.streetAddress,
				isReipListing: listing.isReipListing,
				isReipAgency: listing.isReipAgency
			},
			url
		);
	}

	trackSearchResultsAnalytics(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: TListingSrPageResponse
	) {
		const location = this.listingService.getLocation(
			listingSrResponse.locationESRecords,
			listingSrResponse.streetESRecords
		);

		const screen = this.srViewService.getSearchResultScreen();

		const entityType = this.getAnalyticsStrategyFromConstructors();
		const matomoUrl = entityType.deriveUrlPathAndTitle(screen).url;

		this.trackListings(listingSrResponse.listings);

		if (listingSrResponse.agentBanner && location && location.length > 0) {
			this.trackAgentBannerInteraction(listingSrResponse.agentBanner, 'DisplayBannerAd', location[0], matomoUrl);
		}

		if (appliedFilters.locations && appliedFilters.locations.length > 0 && appliedFilters.locations[0].suburbName) {
			this.trackLocationProfileInteraction(appliedFilters.locations[0], matomoUrl);
		}
		const localExpert = listingSrResponse.localExpert;

		if (localExpert && localExpert.listings && localExpert.listings.length > 0 && location && location.length > 0) {
			this.trackLocalExpertInteraction(localExpert, 'DisplayLocalExpert', location[0], matomoUrl);
			localExpert.listings.map((listing) => {
				const updatedListing = {
					...listing,
					isReipAgency: localExpert.isReipAgency
				};
				this.trackLocalExpertListing('DisplayLocalExpertListing', updatedListing, matomoUrl);
			});
		}
	}

	processPageViewEvents(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: TListingSrPageResponse,
		url?: string
	) {
		const location = this.listingService.getLocation(
			listingSrResponse.locationESRecords,
			listingSrResponse.streetESRecords
		);

		this.trackPageView(appliedFilters, location, url);

		this.trackSearchResultsAnalytics(deviceType, appliedFilters, listingSrResponse);
	}

	trackDrawerInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	) {
		const location = this.listingService.getLocation(locationRecords, streetRecords);

		const entityType = this.getAnalyticsStrategyFromConstructors();

		const { sort, page, ...rest } = appliedFilters;

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			'ClickDrawer',
			'',
			'',
			EAnalyticsEventType.ClickDrawer,
			entityType.getPageViewCommonDimensions(rest, location)
		);
	}

	trackBackToMapButtonInteraction(
		appliedFilters: IListingSrData,
		actionName: string,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	) {
		const location = this.listingService.getLocation(locationRecords, streetRecords);

		const { sort, page, ...rest } = appliedFilters;

		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			actionName,
			'',
			'',
			EAnalyticsEventType.BackToMapButton,
			entityType.getPageViewCommonDimensions(rest, location)
		);
	}

	trackSeoLinkInteraction(eventAction: string, seoLinkDetail: TSeoLinksDimensions) {
		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			eventAction,
			'',
			'',
			EAnalyticsEventType.SeoLink,
			seoLinkDetail
		);
	}

	trackFirstTimeMapMoveInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	) {
		const location = this.listingService.getLocation(locationRecords, streetRecords);

		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			'ViewMap',
			'',
			'',
			EAnalyticsEventType.ViewMap,
			entityType.getPageViewCommonDimensions(appliedFilters, location)
		);
	}

	trackSeeAllButtonInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	) {
		const location = this.listingService.getLocation(locationRecords, streetRecords);

		const { sort, page, ...rest } = appliedFilters;

		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			'ClickSeeAll',
			'',
			'',
			EAnalyticsEventType.SeeAll,
			entityType.getPageViewCommonDimensions(rest, location)
		);
	}

	trackFilterSearchInteraction(
		appliedFilters: IListingSrData,
		location: ILocation[],
		searchKeyword: string,
		gnafId?: string
	) {
		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			'Search',
			'',
			'',
			EAnalyticsEventType.FilterSearch,
			{
				listingId_GnafId: gnafId,
				...entityType.getPageViewCommonDimensions(appliedFilters, location),
				searchKeyword
			}
		);
	}

	trackBreadcrumbInteraction(appliedFilters: IListingSrData | undefined) {
		const entityType = this.getAnalyticsStrategyFromConstructors();

		if (!appliedFilters) {
			return;
		}
		if (!appliedFilters.locations || appliedFilters.locations.length === 0) {
			return this.analyticsService.trackEvent(
				this.getEventCategory(entityType),
				'ClickBreadcrumb',
				'',
				'',
				EAnalyticsEventType.BreadCrumb,
				{
					listingType: this.listingService.getListingTypeBySaleMethod(appliedFilters.saleMethod)
				}
			);
		}

		const location = appliedFilters.locations[0];

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			'ClickBreadcrumb',
			'',
			'',
			EAnalyticsEventType.BreadCrumb,
			{
				listingType: this.listingService.getListingTypeBySaleMethod(appliedFilters.saleMethod),
				state: location.state,
				city: location.city,
				lgaName: location.lgaName,
				suburb: location.suburbName,
				bedroom: appliedFilters.bedrooms,
				bathroom: appliedFilters.bathrooms,
				carpark: appliedFilters.carparks,
				propertyType: appliedFilters.propertyTypes,
				postCode: location.postcode,
				street: location.streetName,
				schoolName: location.schoolName
			}
		);
	}

	trackSaveSearchInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined,
		emailFrequency: string
	) {
		const location = this.listingService.getLocation(locationRecords, streetRecords);

		const { sort, page, ...rest } = appliedFilters;

		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			location && location.length > 0 ? 'SavedSearches' : 'MapSaveSearch',
			'',
			'',
			EAnalyticsEventType.SaveSearch,
			{
				...entityType.getPageViewCommonDimensions(rest, location),
				emailFrequency
			}
		);
	}

	trackMapLayerSwitchInteraction(eventCategory: string, eventAction: string) {
		this.analyticsService.trackEvent(eventCategory, eventAction, '', '', EAnalyticsEventType.SwitchMapLayer, null);
	}

	trackListingDetailInteraction(listing: TPinListing | TListing, eventAction: string) {
		const entityType = this.getAnalyticsStrategyFromData(listing.entityType);

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			eventAction,
			'',
			'',
			EAnalyticsEventType.ViewListing,
			entityType.getEventTrackingCommonDimensions(listing)
		);
	}

	trackPaginationInteraction(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listings: TListing[],
		location: ILocation[],
		url?: string
	) {
		this.trackPageView(appliedFilters, location, url);

		this.trackListings(listings);
	}

	trackPropertyViewInteraction(property: TPinP360, imageSource: EPropertyImageSource) {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.P360,
			'ViewP360Card',
			'',
			'',
			EAnalyticsEventType.ViewProperty,
			{
				listingId_GnafId: property.gnafId,
				state: property.state,
				suburb: property.suburbName,
				bedroom: property.bedrooms,
				bathroom: property.bathrooms,
				carpark: property.carSpaces,
				propertyType: property.propertyType,
				postCode: property.postcode,
				street: property.streetAddress,
				sa1Code: property.sa1Code,
				imageSource: imageSource
			}
		);
	}

	trackClusterMarkerInteraction(
		appliedFilters: IListingSrData,
		locationRecords: TLocationRecord[] | undefined,
		streetRecords: TStreetRecord[] | undefined
	): void {
		const location = this.listingService.getLocation(locationRecords, streetRecords);

		const { sort, page, ...rest } = appliedFilters;

		const entityType = this.getAnalyticsStrategyFromConstructors();

		this.analyticsService.trackEvent(
			this.getEventCategory(entityType),
			'ClickMapClusterPin',
			'',
			'',
			EAnalyticsEventType.ClusterMarkerClick,
			entityType.getPageViewCommonDimensions(rest, location)
		);
	}

	trackSchoolCardInteraction(location: ILocation): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.SchoolCatchment,
			EAnalyticsEventAction.ViewSchoolCard,
			'',
			'',
			EAnalyticsEventType.SchoolCardClick,
			{
				city: location.city,
				lgaName: location.lgaName,
				postCode: location.postcode,
				schoolName: location.schoolName,
				state: location.state,
				suburb: location.suburbName
			}
		);
	}

	trackMapPageView(
		deviceType: EAccessDeviceType,
		appliedFilters: IListingSrData,
		listingSrResponse: TListingSrPageResponse,
		url?: string
	): void {
		const location = this.listingService.getLocation(
			listingSrResponse.locationESRecords,
			listingSrResponse.streetESRecords
		);

		this.trackPageView(appliedFilters, location || [], url);
	}
}
