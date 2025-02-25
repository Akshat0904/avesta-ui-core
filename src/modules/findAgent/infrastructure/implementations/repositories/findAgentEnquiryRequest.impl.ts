import { SendEnquiryRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentEnquiryRequest.interface';
import {
	FindAgentAppraisalRequest,
	FindAgentEnquiryRequest,
	SendAppraisalResponse
} from '@findAgent/types/findAgent.types';
import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';

export class SendEnquiryRepositoryImpl implements SendEnquiryRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}

	async sendAgencyEnquiry(enquiry: FindAgentEnquiryRequest): Promise<string> {
		return this.httpClient.post<any>({
			path: this.config.getApiPaths().sendEnquiry,
			body: enquiry
		});
	}

	async sendAgentEnquiry(enquiry: FindAgentEnquiryRequest): Promise<string> {
		return this.httpClient.post<any>({
			path: this.config.getApiPaths().sendAgentEnquiry,
			body: enquiry
		});
	}

	async sendAppraisal(appraisal: FindAgentAppraisalRequest): Promise<SendAppraisalResponse> {
		return this.httpClient.post<any>({
			path: this.config.getApiPaths().p360AppraisalEnquiry,
			body: appraisal
		});
	}

	async sendAgentAgencyAppraisal(appraisal: FindAgentAppraisalRequest): Promise<SendAppraisalResponse> {
		return this.httpClient.post<any>({
			path: this.config.getApiPaths().sendAgentAgencyAppraisal,
			body: appraisal
		});
	}
}
