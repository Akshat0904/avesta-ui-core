import { SendEnquiryRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentEnquiryRequest.interface';
import { FindAgentAppraisalRequest, SendAppraisalResponse } from '@findAgent/types/findAgent.types';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';

export class SendAppraisalUseCase {
	constructor(private appraisalRepo: SendEnquiryRepository, private toasterService: IToasterService) {}

	async execute(command: FindAgentAppraisalRequest): Promise<SendAppraisalResponse> {
		try {
			const response = await this.appraisalRepo.sendAppraisal(command);
			this.toasterService.customToaster(EToastMsg.appraisalInquirySuccess, 'success');
			return response;
		} catch (error) {
			this.toasterService.customToaster(EToastMsg.appraisalInquiryFailed, 'error');
			return error;
		}
	}
}
