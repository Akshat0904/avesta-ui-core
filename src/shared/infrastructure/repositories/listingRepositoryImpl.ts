import { IHttpService } from '@shared/interfaces/httpService';
import { IListingRepository } from '@shared/interfaces/listingRepository';
import { TFilterCountDetails } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData } from '@realestateview/avesta-js-core';
import { IConfigService } from '../../interfaces/configService';

export class ListingRepositoryImpl implements IListingRepository {
	constructor(private httpClient: IHttpService, private configService: IConfigService) {}

	async getListingsCount(filterDetails: IListingSrData): Promise<TFilterCountDetails> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().filterResultsSummary,
				body: filterDetails
			});
		} catch (error) {
			throw error;
		}
	}
}
