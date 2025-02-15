import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { SendEnquiryCommand } from '@searchResult/commands/sendEnquiry.command';
import { IListingSrRepository } from '@listingSr/core/interfaces/listingSrRepository';
import { SendEnquiryMapper } from '@searchResult/mappers/sendEnquiry.mapper';
import { EnquiryToAgentApiBody } from '@searchResult/types/types';

export class SendEnquiryUseCase {
	constructor(private listingSrRepository: IListingSrRepository, private toasterService: IToasterService) {}

	async execute(command: SendEnquiryCommand): Promise<boolean> {
		const enquiryData: EnquiryToAgentApiBody = SendEnquiryMapper.toApiData(command);

		try {
			const response = await this.listingSrRepository.postEnquiryToAgent(enquiryData);

			if (!response.err) {
				this.toasterService.customToaster(EToastMsg.enquirySent, 'success');
				return true;
			} else {
				throw new Error(response.err.message || EToastMsg.somethingWrongTryLater);
			}
		} catch (error: any) {
			this.toasterService.customToaster(error.message || EToastMsg.somethingWrongTryLater, 'error');
			return false;
		}
	}
}
