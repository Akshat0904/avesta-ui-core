import { SendEnquiryRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentEnquiryRequest.interface';
import { FindAgentAnalyticsService } from '@findAgent/services/analytics/findAgentAnalytics.service';
import { FindAgentEnquiryRequest } from '@findAgent/types/findAgent.types';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { TClickContactAgentDimensions } from '@shared/types/matomo';

export class SendAgentEnquiryUseCase {
	constructor(
		private enquiryRepo: SendEnquiryRepository,
		private toasterService: IToasterService,
		private findAgentAnalyticsService: FindAgentAnalyticsService
	) {}

	async execute(command: FindAgentEnquiryRequest, matomoDetails: TClickContactAgentDimensions): Promise<string> {
		try {
			const response = await this.enquiryRepo.sendAgentEnquiry(command);
			this.toasterService.customToaster(EToastMsg.enquirySent, 'success');
			this.findAgentAnalyticsService.trackClickContactAgent(matomoDetails);
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
