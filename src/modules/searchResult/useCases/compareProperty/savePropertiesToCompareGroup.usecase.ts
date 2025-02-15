import { IToasterService } from '@shared/interfaces/toasterservice';
import { IAuthorization } from '@shared/interfaces/authorization';
import { SubscriberService } from '@shared/services/subscriberService';
import { SavePropertyToCompareGroupCommand } from '@searchResult/commands/compareProperty.command';

export class SavePropertiesToCompareGroupUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private toasterService: IToasterService,
		private authorizedService: IAuthorization
	) {}

	async execute(command: SavePropertyToCompareGroupCommand) {
		try {
			return await this.subscriberService.addListingsToComparisonGroup(command);
		} catch (error: any) {
			if (error.statusCode === 401) {
				this.authorizedService.handle401Error(error.message);
			} else {
				this.toasterService.customToaster(error.message, 'error');
			}
		}
	}
}
