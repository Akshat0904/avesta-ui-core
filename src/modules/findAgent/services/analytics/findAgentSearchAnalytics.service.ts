import { FindAgentFindAgentSearchAnalyticsService } from '@findAgent/infrastructure/interfaces/repositories/services/searchSelectAnalytics.service.interface';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	TAgentSearchSelectionDimensions
} from '@shared/types/matomo';

export class FindAgentSearchAnalyticsService implements FindAgentFindAgentSearchAnalyticsService {
	constructor(private analyticsService: IAnalyticsService) {}
	public trackSearchSelection(matomoDetails: TAgentSearchSelectionDimensions, url?: string): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.Agent,
			EAnalyticsEventAction.Search,
			'',
			'',
			EAnalyticsEventType.AgentSearch,
			matomoDetails,
			url
		);
	}
}
