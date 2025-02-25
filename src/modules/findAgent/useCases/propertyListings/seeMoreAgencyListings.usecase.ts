import { AgencyPropertyListingCommand } from '@findAgent/commands/propertyListing.command';
import { IPropertyListingsRepository } from '@findAgent/infrastructure/interfaces/repositories/propertyListings.interface';
import { ListingResponse } from '@findAgent/types/agency.types';

export class SeeMoreAgencyListingsUseCase {
	constructor(private propertyListingsRepo: IPropertyListingsRepository) {}

	async execute(command: AgencyPropertyListingCommand): Promise<ListingResponse> {
		try {
			return await this.propertyListingsRepo.getAgencyPropertyListings(command);
		} catch (error) {
			throw error;
		}
	}
}
