import { SearchSuggestionCommand } from '@findAgent/commands/searchSuggestion.command';
import { LocationsAndAgenciesSearchResponse, PropertyResponse } from '@findAgent/types/findAgent.types';
import {
	AgencySearchResultRequest,
	AgencySearchResultResponse,
	AgentSearchResultRequest,
	AgentSearchResultResponse
} from '@findAgent/types/agentAgencySr.types';

export interface FindAgentSearchRepository {
	getSearchSuggestionsBySearchKeyWord: (
		command: SearchSuggestionCommand
	) => Promise<LocationsAndAgenciesSearchResponse>;
	getPropertySearchSuggestionsBySearchKeyWord: (command: SearchSuggestionCommand) => Promise<PropertyResponse[]>;

	getAgencySearchData: (data: AgencySearchResultRequest) => Promise<AgencySearchResultResponse>;
	getAgentSearchData: (data: AgentSearchResultRequest) => Promise<AgentSearchResultResponse>;
}
