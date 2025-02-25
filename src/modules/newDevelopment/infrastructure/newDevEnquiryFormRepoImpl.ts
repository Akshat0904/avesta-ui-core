import { INewDevEnquiryFormRepository } from '@newDevelopment/core/interface/newDevEnquiryFormRepository';
import { TNewDevEnquiryFormData } from '@newDevelopment/core/types/newDevelopmentTypes';
import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';

export class NewDevEnquiryFormRepoImpl implements INewDevEnquiryFormRepository {
	constructor(private httpService: IHttpService, private configService: IConfigService) {}
	async postEnquiryFormData(params: TNewDevEnquiryFormData) {
		try {
			return await this.httpService.post<any>({
				path: this.configService.getApiPaths().enquiryForm,
				body: params
			});
		} catch (error) {
			throw error;
		}
	}
}
