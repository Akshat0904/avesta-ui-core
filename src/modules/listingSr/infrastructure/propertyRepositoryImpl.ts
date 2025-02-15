import { IHttpService } from '@shared/interfaces/httpService';
import { IConfigService } from '@shared/interfaces/configService';
import { IPropertyRepository } from '../core/interfaces/priceEstimatorRepository';

export class PropertyRepositoryImpl implements IPropertyRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}

	async getDetailUrl(gnafId: string) {
		try {
			const result = await this.httpClient.get<any>({
				path: this.config.getApiPaths().listingUrlForP360Property,
				queryParams: { gnafId }
			});
			return result.data;
		} catch (error) {
			throw error;
		}
	}
}
