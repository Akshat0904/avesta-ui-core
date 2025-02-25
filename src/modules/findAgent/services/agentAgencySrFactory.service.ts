import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import { EAgentAgencyTab } from '@findAgent/types/enum';
import { AgentSearchHandler } from './agentSearchHandler.service';
import { AgencySearchHandler } from './agencySearchHandler.service';

export class AgentAgencySrFactory {
	constructor(private findAgentSearchRepository: FindAgentSearchRepository) {}

	create(activeTab: EAgentAgencyTab) {
		switch (activeTab) {
			case EAgentAgencyTab.AGENT:
				return new AgentSearchHandler(this.findAgentSearchRepository);
			case EAgentAgencyTab.AGENCY:
				return new AgencySearchHandler(this.findAgentSearchRepository);
			default:
				throw new Error('Invalid tab type');
		}
	}
}
