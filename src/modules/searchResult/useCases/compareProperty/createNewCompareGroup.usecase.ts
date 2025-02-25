import { IToasterService } from '@shared/interfaces/toasterservice';
import { IAuthorization } from '@shared/interfaces/authorization';
import { SubscriberService } from '@shared/services/subscriberService';

export class CreateNewCompareGroupUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private toasterService: IToasterService,
		private authorizedService: IAuthorization
	) {}

	async execute(groupName: string) {
		try {
			return await this.subscriberService.addNewComparisonGroup({ groupName });
		} catch (error: any) {
			if (error.statusCode === 401) {
				this.authorizedService.handle401Error(error.message);
			} else {
				this.toasterService.customToaster(error.message, 'error');
			}
		}
	}
}
