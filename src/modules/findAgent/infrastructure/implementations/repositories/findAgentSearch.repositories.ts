import { SearchSuggestionCommand } from '@findAgent/commands/searchSuggestion.command';
import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import {
	LocationsAndAgenciesSearchResponse,
	PropertyResponse,
	PropertySearchSuggestionResponse,
	SearchSuggestionResponse
} from '@findAgent/types/findAgent.types';
import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';
import {
	AgencySearchResultRequest,
	AgencySearchResultResponse,
	AgentSearchResultRequest,
	AgentSearchResultResponse
} from '@findAgent/types/agentAgencySr.types';
export class FindAgentSearchRepositoryImpl implements FindAgentSearchRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}
	async getSearchSuggestionsBySearchKeyWord(
		command: SearchSuggestionCommand
	): Promise<LocationsAndAgenciesSearchResponse> {
		try {
			const response = await this.httpClient.get<SearchSuggestionResponse>({
				path: this.config.getApiPaths().findAgentSearchSuggestion,
				queryParams: { searchText: command.searchKeyword }
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getPropertySearchSuggestionsBySearchKeyWord(command: SearchSuggestionCommand): Promise<PropertyResponse[]> {
		try {
			const excludeLocationSearch = {
				excludeLocations: true,
				excludeStreets: true,
				excludeProperties: false,
				excludeProject: true,
				excludeSchool: true
			};
			const response = await this.httpClient.post<PropertySearchSuggestionResponse>({
				path: this.config.getApiPaths().findPropertySearchSuggestion,
				body: {
					searchText: command.searchKeyword,
					scope: excludeLocationSearch
				}
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getAgencySearchData(data: AgencySearchResultRequest): Promise<AgencySearchResultResponse> {
		const apiUrl = this.getApiUrl(this.config.getApiPaths().agencySearchResult, data);
		try {
			const response = await this.httpClient.get<{ success: string; data: AgencySearchResultResponse }>({
				path: apiUrl
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getAgentSearchData(data: AgentSearchResultRequest): Promise<AgentSearchResultResponse> {
		const apiUrl = this.getApiUrl(this.config.getApiPaths().agentSearchResult, data);
		try {
			const response = await this.httpClient.get<{ success: string; data: AgentSearchResultResponse }>({
				path: apiUrl
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	private getApiUrl(path: string, data: AgencySearchResultRequest | AgentSearchResultRequest): string {
		const params = new URLSearchParams({
			suburbNameSlug: data.suburbNameSlug,
			postcode: data.postcode,
			state: data.state
		});

		if (data.propertyTypes) {
			data.propertyTypes.forEach((type) => params.append('propertyTypes[]', type));
		}

		if (data.page) {
			params.append('page', data.page.toString());
		}

		if (data.size) {
			params.append('size', Number(data.size).toString());
		}

		if (data.sort) {
			params.append('sort', data.sort);
		}

		return `${path}?${params.toString()}`;
	}
}
