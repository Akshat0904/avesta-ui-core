import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import { ICalculatorAnalyticsService } from '../infrastructure/repositories/interfaces/services/calculatorAnalyticsService.interface';
import { EAnalyticsEventAction, EAnalyticsEventCategory, EAnalyticsEventType } from '@shared/types/matomo';

export class ListingCalculatorAnalyticsService implements ICalculatorAnalyticsService {
	constructor(private analyticsService: IAnalyticsService) {}

	public trackCalculatorUsage(matomoDetails: any): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Listings,
			EAnalyticsEventAction.RepaymentCalculator,
			'',
			'',
			EAnalyticsEventType.RepaymentCalculator,
			matomoDetails
		);
	}
}
