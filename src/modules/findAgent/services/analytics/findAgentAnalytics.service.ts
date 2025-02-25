import { IFindAgentAnalyticsService } from '@findAgent/infrastructure/interfaces/repositories/services/findAgentAnalyticsService.interface';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	TClickContactAgentDimensions,
	TClickSearchAddressDimensions,
	TClickSponsoredAgencyEnquiryDimensions,
	TClickSubscribeTodayDimensions,
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

export class FindAgentAnalyticsService implements IFindAgentAnalyticsService {
	constructor(private analyticsService: IAnalyticsService) {}
	public trackAdBanner(matomoDetails: TClickSubscribeTodayDimensions, url?: string): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickSubscribeToday,
			'',
			'',
			EAnalyticsEventType.ClickSubscribeToday,
			matomoDetails,
			url
		);
	}
	public trackSearchAddress(matomoDetails: TClickSearchAddressDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickSearchAddress,
			'',
			'',
			EAnalyticsEventType.ClickSearchAddress,
			matomoDetails
		);
	}
	public trackFreeAppraisal(matomoDetails: TFreeAppraisalDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickAgentPropertyAppraisal,
			'',
			'',
			EAnalyticsEventType.ClickAgentPropertyAppraisal,
			matomoDetails
		);
	}

	public trackWatchAgencyVideo(matomoDetails: TWatchAgencyVideoDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.WatchAgencyVideo,
			'',
			'',
			EAnalyticsEventType.WatchAgencyVideo,
			matomoDetails
		);
	}
	public trackFilterProperties(matomoDetails: TFilterPropertiesDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.FilterProperties,
			'',
			'',
			EAnalyticsEventType.FilterProperties,
			matomoDetails
		);
	}
	public trackClickContactAgent(matomoDetails: TClickContactAgentDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickContactAgent,
			'',
			'',
			EAnalyticsEventType.ClickContactAgent,
			matomoDetails
		);
	}

	public trackSponsoredAgencyEnquiry(matomoDetails: TClickSponsoredAgencyEnquiryDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickSponsoredAgencyEnquiry,
			'',
			'',
			EAnalyticsEventType.ClickSponsoredAgencyEnquiry,
			matomoDetails
		);
	}

	public trackSponsoredAgencies(matomoDetails: TDisplaySponsoredAgenciesDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.DisplaySponsoredAgencies,
			'',
			'',
			EAnalyticsEventType.DisplaySponsoredAgencies,
			matomoDetails
		);
	}

	public trackSubmitFreeAppraisal(matomoDetails: TSubmitFreeAppraisalDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.SubmitAgentPropertyAppraisal,
			'',
			'',
			EAnalyticsEventType.SubmitAgentPropertyAppraisal,
			matomoDetails
		);
	}

	public trackCallAgent(matomoDetails: TCallAgentDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.CallAgent,
			'',
			'',
			EAnalyticsEventType.CallAgent,
			matomoDetails
		);
	}

	public trackAgentEnquiry(matomoDetails: TAgentEnquiryDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickAgentEnquiry,
			'',
			'',
			EAnalyticsEventType.ClickAgentEnquiry,
			matomoDetails
		);
	}

	public trackClickAgencyEnquiry(matomoDetails: TAgencyEnquiryClickDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ViewEnquire,
			'',
			'',
			EAnalyticsEventType.ViewEnquire,
			matomoDetails
		);
	}

	public trackSubmitAgencyEnquiry(matomoDetails: TAgencyEnquirySubmitDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickEnquire,
			'',
			'',
			EAnalyticsEventType.ClickEnquire,
			matomoDetails
		);
	}
}
