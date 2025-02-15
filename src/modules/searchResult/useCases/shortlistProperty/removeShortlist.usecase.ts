import { IToasterService } from '@shared/interfaces/toasterservice';
import { IAuthorization } from '@shared/interfaces/authorization';
import { EToastMsg } from '@shared/types/enums';
import { SubscriberService } from '@shared/services/subscriberService';
import { ShortlistCommand } from '@searchResult/commands/shortlist.command';

export class RemoveShortlistUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private toasterService: IToasterService,
		private authorizedService: IAuthorization
	) {}

	async execute(command: ShortlistCommand) {
		try {
			const response = await this.subscriberService.removePropertyFromShortlist(command);

			this.toasterService.customToaster(response.message || EToastMsg.removeFavourite, 'success');
		} catch (error: any) {
			if (error.statusCode === 401) {
				return this.authorizedService.handle401Error(error.message);
			} else {
				return this.toasterService.customToaster(error.message, 'error');
			}
		}
	}
}
