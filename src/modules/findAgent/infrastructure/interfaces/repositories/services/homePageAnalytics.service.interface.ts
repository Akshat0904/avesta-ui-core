import {
	TAgentSrListingDimensions,
	TAgencySrListingDimensions,
	TAgencyPageDimensions,
	TAgentPageDimensions,
	TAgentAgencyPropertyListingsDimensions
} from '@shared/types/matomo';

export interface FindAgentPageAnalyticsService {
	trackHomePage(): void;
	trackAgentSrPage(matomoDetails: TAgentSrListingDimensions): void;
	trackAgencySrPage(matomoDetails: TAgencySrListingDimensions): void;
	trackAgencyDetailPage(matomoDetails: TAgencyPageDimensions): void;
	trackAgentDetailPage(matomoDetails: TAgentPageDimensions): void;
	trackAgentAgencyPropertyListings(matomoDetails: TAgentAgencyPropertyListingsDimensions): void;
}
