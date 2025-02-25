import { AgentAgencySearchCommand } from '@findAgent/commands/search.command';
import { AgentSearchResultRequest, AgencySearchResultRequest } from '@findAgent/types/agentAgencySr.types';

export class AgencyMapper {
	static toAgencySearchRequest(command: AgentAgencySearchCommand): AgencySearchResultRequest {
		const requestBody: AgencySearchResultRequest = {
			suburbNameSlug: command.suburbNameSlug,
			postcode: command.postcode,
			state: command.state,
			page: command.page || 1,
			size: command.size || 10
		};
		if (command.propertyTypes) {
			requestBody.propertyTypes = command.propertyTypes;
		}

		if (command.sort) {
			requestBody.sort = command.sort;
		}

		return requestBody;
	}

	static toAgentSearchRequest(command: AgentAgencySearchCommand): AgentSearchResultRequest {
		const requestBody: AgentSearchResultRequest = {
			suburbNameSlug: command.suburbNameSlug,
			postcode: command.postcode,
			state: command.state,
			page: command.page || 1,
			size: command.size || 10
		};
		if (command.propertyTypes) {
			requestBody.propertyTypes = command.propertyTypes;
		}

		if (command.sort) {
			requestBody.sort = command.sort;
		}

		return requestBody;
	}
}
