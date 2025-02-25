import { IAgencyProfileAnalytics } from '@findAgent/infrastructure/interfaces/repositories/services/agencyProfileAnalytics.interface';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import {
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	TClickAgencyPhoneAndEmailDimensions,
	TClickEmailUsDimensions
} from '@shared/types/matomo';
import { EAnalyticsEventAction } from '@shared/types/matomo';

export class AgencyProfileAnalytics implements IAgencyProfileAnalytics {
	constructor(private readonly analyticsService: IAnalyticsService) {}

	public trackClickAgencyPhone(matomoDetails: TClickAgencyPhoneAndEmailDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ViewAgencyPhone,
			'',
			'',
			EAnalyticsEventType.ViewAgencyPhone,
			matomoDetails
		);
	}

	public trackViewEmailUs(matomoDetails: TClickAgencyPhoneAndEmailDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ViewEmailUs,
			'',
			'',
			EAnalyticsEventType.ViewEmailUs,
			matomoDetails
		);
	}

	public trackClickEmailUs(matomoDetails: TClickEmailUsDimensions): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.ClickEmailUs,
			'',
			'',
			EAnalyticsEventType.ClickEmailUs,
			matomoDetails
		);
	}
}
