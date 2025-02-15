import { INewDevEnquiryFormRepository } from '../interface/newDevEnquiryFormRepository';
import { TNewDevEnquiryFormData } from '../types/newDevelopmentTypes';

export class NewDevEnquiryFormService {
	constructor(private repo: INewDevEnquiryFormRepository) {}
	postEnquiryFormData(params: TNewDevEnquiryFormData) {
		return this.repo.postEnquiryFormData(params);
	}
}
