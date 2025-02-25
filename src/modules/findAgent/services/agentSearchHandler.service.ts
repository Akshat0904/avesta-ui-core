import { AgentAgencySearchCommand } from '@findAgent/commands/search.command';
import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import { AgencyMapper } from '@findAgent/mappers/agency.mapper';
import { AgentSearchResultResponse } from '@findAgent/types/agentAgencySr.types';

export class AgentSearchHandler {
	constructor(private findAgentSearchRepository: FindAgentSearchRepository) {}

	async handle(command: AgentAgencySearchCommand): Promise<AgentSearchResultResponse> {
		try {
			const searchRequest = AgencyMapper.toAgentSearchRequest(command);
			const response = await this.findAgentSearchRepository.getAgentSearchData(searchRequest);

			return response;
		} catch (error) {
			throw error;
		}
	}
}
