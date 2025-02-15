import { SearchSuggestionCommand } from '@findAgent/commands/searchSuggestion.command';
import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import { GroupSearchSuggestionMapper } from '@findAgent/mappers/groupSearchSuggestion.mapper';
import { GroupSearchSuggestion } from '@findAgent/types/findAgent.types';

export class SearchSuggestionUseCase {
	constructor(private repo: FindAgentSearchRepository) {}
	async execute(command: SearchSuggestionCommand): Promise<GroupSearchSuggestion[]> {
		try {
			const response = await this.repo.getSearchSuggestionsBySearchKeyWord(command);
			return GroupSearchSuggestionMapper.toPresentation(response);
		} catch (error) {
			throw error;
		}
	}
}
