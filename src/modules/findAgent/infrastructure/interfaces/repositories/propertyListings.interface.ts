import { AgencyPropertyListingCommand, AgentPropertyListingCommand } from '@findAgent/commands/propertyListing.command';
import { ListingResponse } from '@findAgent/types/agency.types';

export interface IPropertyListingsRepository {
	getAgentPropertyListings: (command: AgentPropertyListingCommand) => Promise<ListingResponse>;
	getAgencyPropertyListings: (command: AgencyPropertyListingCommand) => Promise<ListingResponse>;
}
