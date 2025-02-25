import { AgencyPropertyListingCommand, AgentPropertyListingCommand } from '@findAgent/commands/propertyListing.command';
import { IPropertyListingsRepository } from '@findAgent/infrastructure/interfaces/repositories/propertyListings.interface';
import { ListingResponse } from '@findAgent/types/agency.types';
import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';

export class PropertyListingsRepositoryImpl implements IPropertyListingsRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}

	async getAgentPropertyListings(command: AgentPropertyListingCommand): Promise<ListingResponse> {
		try {
			const response = await this.httpClient.get<any>({
				path: this.config.getApiPaths().agentListings,
				queryParams: command
			});
			return {
				data: response.data.listings,
				total: response.data.total
			};
		} catch (error) {
			throw error;
		}
	}

	async getAgencyPropertyListings(command: AgencyPropertyListingCommand): Promise<ListingResponse> {
		try {
			const response = await this.httpClient.get<any>({
				path: this.config.getApiPaths().agencyListings,
				queryParams: command
			});
			return {
				data: response.data.listings,
				total: response.data.total
			};
		} catch (error) {
			throw error;
		}
	}
}
