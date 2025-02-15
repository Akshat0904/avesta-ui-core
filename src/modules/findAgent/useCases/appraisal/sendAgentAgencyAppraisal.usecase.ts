import { SendEnquiryRepository } from '@findAgent/infrastructure/interfaces/repositories/findAgentEnquiryRequest.interface';
import { FindAgentAnalyticsService } from '@findAgent/services/analytics/findAgentAnalytics.service';
import { FindAgentAppraisalRequest, SendAppraisalResponse } from '@findAgent/types/findAgent.types';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { TSubmitFreeAppraisalDimensions } from '@shared/types/matomo';

export class SendAgentAgencyAppraisalUseCase {
	constructor(
		private appraisalRepo: SendEnquiryRepository,
		private toasterService: IToasterService,
		private findAgentAnalyticsService: FindAgentAnalyticsService
	) {}

	async execute(
		command: FindAgentAppraisalRequest,
		matomoDetails: TSubmitFreeAppraisalDimensions
	): Promise<SendAppraisalResponse> {
		try {
			const response = await this.appraisalRepo.sendAgentAgencyAppraisal(command);
			this.toasterService.customToaster(EToastMsg.appraisalInquirySuccess, 'success');
			this.findAgentAnalyticsService.trackSubmitFreeAppraisal(matomoDetails);
			return response;
		} catch (error) {
			this.toasterService.customToaster(EToastMsg.appraisalInquiryFailed, 'error');
			return error;
		}
	}
}
