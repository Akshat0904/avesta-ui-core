import { TEnquiryFormResponse, TNewDevEnquiryFormData } from '../types/newDevelopmentTypes';

export interface INewDevEnquiryFormRepository {
	postEnquiryFormData: (data: TNewDevEnquiryFormData) => Promise<TEnquiryFormResponse>;
}
