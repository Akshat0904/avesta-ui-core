import { FindAgentPageAnalyticsService } from '@findAgent/infrastructure/interfaces/repositories/services/homePageAnalytics.service.interface';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	EAnalyticsTitleType,
	TAgentAgencyPropertyListingsDimensions,
	TAgencyPageDimensions,
	TAgentPageDimensions,
	TAgencySrListingDimensions,
	TAgentSrListingDimensions,
	TAgentSearchPageDimensions,
	TAgencySearchPageDimensions
} from '@shared/types/matomo';

export class FindAgentPageViewAnalyticsService implements FindAgentPageAnalyticsService {
	constructor(private analyticsService: IAnalyticsService) {}

	trackHomePage() {
		this.analyticsService.trackPageView(EAnalyticsTitleType.AgentSearchPage, 'home/agent/', {});
	}

	trackSearchAgentPage(matomoDetails: TAgentSearchPageDimensions, url?: string) {
		this.analyticsService.trackPageView(EAnalyticsTitleType.SearchAgentPage, url || '', matomoDetails);
	}

	trackSearchAgencyPage(matomoDetails: TAgencySearchPageDimensions, url?: string) {
		this.analyticsService.trackPageView(EAnalyticsTitleType.SearchAgencyPage, url || '', matomoDetails);
	}

	trackAgentSrPage(matomoDetails: TAgentSrListingDimensions) {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.InAgentSearchResult,
			'',
			'',
			EAnalyticsEventType.AgentSrListing,
			matomoDetails
		);
	}

	trackAgencySrPage(matomoDetails: TAgencySrListingDimensions) {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.InSearchResult,
			'',
			'',
			EAnalyticsEventType.AgencySrListing,
			matomoDetails
		);
	}

	trackAgencyDetailPage(matomoDetails: TAgencyPageDimensions) {
		this.analyticsService.trackPageView(EAnalyticsTitleType.AgencyPage, '/agency/', matomoDetails);
	}

	trackAgentDetailPage(matomoDetails: TAgentPageDimensions) {
		this.analyticsService.trackPageView(EAnalyticsTitleType.AgentPage, '/agent/', matomoDetails);
	}

	trackAgentAgencyPropertyListings(matomoDetails: TAgentAgencyPropertyListingsDimensions) {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Listings,
			EAnalyticsEventAction.InSearchResult,
			'',
			'',
			EAnalyticsEventType.AgencyDetailListing,
			matomoDetails
		);
	}
}
