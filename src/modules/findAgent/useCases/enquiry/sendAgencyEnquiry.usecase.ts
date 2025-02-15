import { SendEnquiryRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentEnquiryRequest.interface';
import { FindAgentEnquiryRequest } from '@findAgent/types/findAgent.types';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';

export class SendAgencyEnquiryUseCase {
	constructor(private enquiryRepo: SendEnquiryRepository, private toasterService: IToasterService) {}

	async execute(command: FindAgentEnquiryRequest): Promise<string> {
		try {
			const response = await this.enquiryRepo.sendAgencyEnquiry(command);
			this.toasterService.customToaster(EToastMsg.enquirySent, 'success');
			return response;
		} catch (error: any) {
			this.toasterService.customToaster(
				error.message || 'Failed to send enquiry. Please try again later.',
				'error'
			);
			return error;
		}
	}
}
