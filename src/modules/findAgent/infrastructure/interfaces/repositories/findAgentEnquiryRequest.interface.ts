import {
	FindAgentAppraisalRequest,
	FindAgentEnquiryRequest,
	SendAppraisalResponse
} from '@findAgent/types/findAgent.types';

export interface SendEnquiryRepository {
	sendAgencyEnquiry: (enquiry: FindAgentEnquiryRequest) => Promise<string>;
	sendAgentEnquiry: (enquiry: FindAgentEnquiryRequest) => Promise<string>;
	sendAppraisal: (appraisal: FindAgentAppraisalRequest) => Promise<SendAppraisalResponse>;
	sendAgentAgencyAppraisal: (appraisal: FindAgentAppraisalRequest) => Promise<SendAppraisalResponse>;
}
