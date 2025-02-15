import { INewDevDetailRepository } from '@newDevelopment/core/interface/newDevDetailRepository';
import { TNewDevChildDetailParams, TNewDevParentDetailParams } from '../types/newDevelopmentTypes';

export class NewDevDetailService {
	constructor(private repo: INewDevDetailRepository) {}

	getParentPropertyDetail(params: TNewDevParentDetailParams) {
		return this.repo.getParentPropertyDetail(params);
	}

	getChildPropertyDetail(params: TNewDevChildDetailParams) {
		return this.repo.getChildPropertyDetail(params);
	}
}
