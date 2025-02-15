import { IHttpService } from '@shared/interfaces/httpService';
import { IPropertyImageRepository } from '@shared/interfaces/propertyImageRepository';
import { TImageConfigurationParams, TImagePropertyResponse } from '../../types/types';
import { IConfigService } from '../../interfaces/configService';
export class PropertyImageRepositoryImpl implements IPropertyImageRepository {
	constructor(private httpClient: IHttpService, private configService: IConfigService) {}

	async getDynamicImageDetails(propertyData: TImageConfigurationParams): Promise<TImagePropertyResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().dynamicPropertyImage,
				body: propertyData
			});
		} catch (error) {
			throw error;
		}
	}
}
