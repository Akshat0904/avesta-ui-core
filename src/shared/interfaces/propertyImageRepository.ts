import { TImageConfigurationParams, TImagePropertyResponse } from '@shared/types/types';

export interface IPropertyImageRepository {
	getDynamicImageDetails: (propertyData: TImageConfigurationParams) => Promise<TImagePropertyResponse>;
}
