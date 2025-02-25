import { IToasterService } from '@shared/interfaces/toasterservice';
import { IAuthorization } from '@shared/interfaces/authorization';
import { ShortlistCommand } from '@searchResult/commands/shortlist.command';
import { SubscriberService } from '@shared/services/subscriberService';
import { EToastMsg } from '@shared/types/enums';

export class AddShortlistUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private toasterService: IToasterService,
		private authorizedService: IAuthorization
	) {}

	async execute(command: ShortlistCommand) {
		try {
			const response = await this.subscriberService.addPropertyToShortlist(command);

			this.toasterService.customToaster(response.message || EToastMsg.addFavourite, 'success');
			return;
		} catch (error: any) {
			if (error.statusCode === 401) {
				return this.authorizedService.handle401Error(error.message);
			} else {
				return this.toasterService.customToaster(error.message, 'error');
			}
		}
	}
}
