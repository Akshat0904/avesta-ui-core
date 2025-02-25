import { TImageConfigurationParams, TImagePropertyResponse } from '@shared/types/types';
import { IPropertyImageRepository } from '@shared/interfaces/propertyImageRepository';

export class PropertyImageService {
	constructor(private repo: IPropertyImageRepository) {}

	async getDynamicImage(propertyData: TImageConfigurationParams): Promise<TImagePropertyResponse> {
		return this.repo.getDynamicImageDetails(propertyData);
	}
}
