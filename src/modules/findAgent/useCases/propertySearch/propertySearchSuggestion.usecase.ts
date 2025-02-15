import { PropertySearchSuggestionCommand } from '@findAgent/commands/searchSuggestion.command';
import { FindAgentSearchRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentSearch.interface';
import { PropertyResponse } from '@findAgent/types/findAgent.types';

export class PropertySearchSuggestionUseCase {
	constructor(private repo: FindAgentSearchRepository) {}
	async execute(command: PropertySearchSuggestionCommand): Promise<PropertyResponse[]> {
		try {
			const response = await this.repo.getPropertySearchSuggestionsBySearchKeyWord(command);
			return response;
		} catch (error) {
			throw error;
		}
	}
}
