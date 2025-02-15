import {
	TClickSearchAddressDimensions,
	TClickSponsoredAgencyEnquiryDimensions,
	TClickSubscribeTodayDimensions,
	TClickContactAgentDimensions,
	TWatchAgencyVideoDimensions,
	TFilterPropertiesDimensions,
	TFreeAppraisalDimensions,
	TDisplaySponsoredAgenciesDimensions,
	TSubmitFreeAppraisalDimensions,
	TCallAgentDimensions,
	TAgentEnquiryDimensions,
	TAgencyEnquiryClickDimensions,
	TAgencyEnquirySubmitDimensions
} from '@shared/types/matomo';

export interface IFindAgentAnalyticsService {
	trackAdBanner(matomoDetails: TClickSubscribeTodayDimensions, url?: string): void;
	trackSearchAddress(matomoDetails: TClickSearchAddressDimensions): void;
	trackFreeAppraisal(matomoDetails: TFreeAppraisalDimensions): void;
	trackWatchAgencyVideo(matomoDetails: TWatchAgencyVideoDimensions): void;
	trackFilterProperties(matomoDetails: TFilterPropertiesDimensions): void;
	trackClickContactAgent(matomoDetails: TClickContactAgentDimensions): void;
	trackCallAgent(matomoDetails: TCallAgentDimensions): void;
	trackSponsoredAgencyEnquiry(matomoDetails: TClickSponsoredAgencyEnquiryDimensions): void;
	trackSponsoredAgencies(matomoDetails: TDisplaySponsoredAgenciesDimensions): void;
	trackSubmitFreeAppraisal(matomoDetails: TSubmitFreeAppraisalDimensions): void;
	trackAgentEnquiry(matomoDetails: TAgentEnquiryDimensions): void;
	trackClickAgencyEnquiry(matomoDetails: TAgencyEnquiryClickDimensions): void;
	trackSubmitAgencyEnquiry(matomoDetails: TAgencyEnquirySubmitDimensions): void;
}
