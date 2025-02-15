import { AgentAgencySearchCommand } from '@findAgent/commands/search.command';
import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import { AgentAgencySrFactory } from '@findAgent/services/agentAgencySrFactory.service';
import { FindAgentSearchAnalyticsService } from '@findAgent/services/analytics/findAgentSearchAnalytics.service';
import { AgencySearchResultResponse, AgentSearchResultResponse } from '@findAgent/types/agentAgencySr.types';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { TAgentSearchSelectionDimensions } from '@shared/types/matomo';

export class AgentAgencySearchUseCase {
	constructor(
		private findAgentSearchRepository: FindAgentSearchRepository,
		private toasterService: IToasterService,
		private findAgentSearchAnalyticsService: FindAgentSearchAnalyticsService
	) {}

	async execute(
		command: AgentAgencySearchCommand,
		matomoDetails?: TAgentSearchSelectionDimensions
	): Promise<AgentSearchResultResponse | AgencySearchResultResponse> {
		try {
			const handler = new AgentAgencySrFactory(this.findAgentSearchRepository).create(command.activeTab);
			const response = await handler.handle(command);
			matomoDetails && this.findAgentSearchAnalyticsService.trackSearchSelection(matomoDetails);
			return response;
		} catch (error: any) {
			this.toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
			throw error;
		}
	}
}
