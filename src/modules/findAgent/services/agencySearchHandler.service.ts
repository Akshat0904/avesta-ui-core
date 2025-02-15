import { AgentAgencySearchCommand } from '@findAgent/commands/search.command';
import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import { AgencyMapper } from '@findAgent/mappers/agency.mapper';
import { AgencySearchResultResponse } from '@findAgent/types/agentAgencySr.types';

export class AgencySearchHandler {
	constructor(private findAgentSearchRepository: FindAgentSearchRepository) {}

	async handle(command: AgentAgencySearchCommand): Promise<AgencySearchResultResponse> {
		try {
			const searchRequest = AgencyMapper.toAgencySearchRequest(command);
			const response = await this.findAgentSearchRepository.getAgencySearchData(searchRequest);

			return response;
		} catch (error) {
			throw error;
		}
	}
}
