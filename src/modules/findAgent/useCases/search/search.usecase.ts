import { FindAgentSearchAnalyticsService } from '@findAgent/services/analytics/findAgentSearchAnalytics.service';
import { SearchChangeHandleFactory } from '@findAgent/services/searchChangeHandleFactory.service';
import { EAgentAgencyTab } from '@findAgent/types/enum';
import { INavigationService } from '@shared/interfaces/navigationService';
import { TAgentSearchSelectionDimensions } from '@shared/types/matomo';

export class SearchUseCase {
	constructor(
		private navigationService: INavigationService,
		private searchSelectAnalyticsService: FindAgentSearchAnalyticsService
	) {}
	async execute(
		command: any,
		matomoDetails: TAgentSearchSelectionDimensions,
		url?: string,
		activeTab?: EAgentAgencyTab
	): Promise<any> {
		try {
			const searchChangeHandleFactory = new SearchChangeHandleFactory();
			const searchUrl = searchChangeHandleFactory.create(command, activeTab);
			this.searchSelectAnalyticsService.trackSearchSelection(matomoDetails, url);
			searchUrl && this.navigationService.navigateTo(`${searchUrl}`);
		} catch (error) {
			throw error;
		}
	}
}
