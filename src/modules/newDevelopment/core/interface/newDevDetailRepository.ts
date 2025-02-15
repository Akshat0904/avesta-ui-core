import { TNewDevChildDetailParams, TNewDevParentDetailParams } from '../types/newDevelopmentTypes';

export interface INewDevDetailRepository {
	getParentPropertyDetail: (params: TNewDevParentDetailParams) => Promise<any>;

	getChildPropertyDetail: (params: TNewDevChildDetailParams) => Promise<any>;
}
