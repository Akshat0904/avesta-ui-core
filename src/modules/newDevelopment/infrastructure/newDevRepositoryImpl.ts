import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';
import { INewDevDetailRepository } from '@newDevelopment/core/interface/newDevDetailRepository';
import { UrlService } from '@realestateview/avesta-js-core';
import { TNewDevChildDetailParams, TNewDevParentDetailParams } from '@newDevelopment/core/types/newDevelopmentTypes';

export class NewDevRepositoryImpl implements INewDevDetailRepository {
	constructor(private httpService: IHttpService, private configService: IConfigService) {}

	async getParentPropertyDetail(params: TNewDevParentDetailParams) {
		try {
			return this.httpService.get<any>({
				path: this.configService.getApiPaths().newDevParentDetailPage,
				queryParams: params
			});
		} catch (error) {
			throw error;
		}
	}

	async getChildPropertyDetail(params: TNewDevChildDetailParams) {
		UrlService.ProjectDetail.getDataFromProjectDetailUrl('');
		try {
			return this.httpService.get<any>({
				path: this.configService.getApiPaths().newDevChildDetailPage,
				queryParams: params
			});
		} catch (error) {
			throw error;
		}
	}
}
