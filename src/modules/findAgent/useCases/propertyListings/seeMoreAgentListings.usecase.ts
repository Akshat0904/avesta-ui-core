import { AgentPropertyListingCommand } from '@findAgent/commands/propertyListing.command';
import { IPropertyListingsRepository } from '@findAgent/infrastructure/interfaces/repositories/propertyListings.interface';
import { ListingResponse } from '@findAgent/types/agency.types';

export class SeeMoreAgentListingsUseCase {
	constructor(private propertyListingsRepo: IPropertyListingsRepository) {}

	async execute(command: AgentPropertyListingCommand): Promise<ListingResponse> {
		try {
			return await this.propertyListingsRepo.getAgentPropertyListings(command);
		} catch (error) {
			throw error;
		}
	}
}
