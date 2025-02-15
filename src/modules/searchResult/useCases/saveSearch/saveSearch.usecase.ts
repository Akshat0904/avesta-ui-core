import { SaveSearchCommand } from '@searchResult/commands/saveSearch.command';
import { SubscriberService } from '@shared/services/subscriberService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { ISrAnalyticsService } from '@listingSr/core/interfaces/srAnalyticsService';
import { IAuthorization } from '@shared/interfaces/authorization';
import { SaveSearchMapper } from '@searchResult/mappers/saveSearch.mapper';

export class SaveSearchUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private toasterService: IToasterService,
		private srAnalyticsService: ISrAnalyticsService,
		private authorizedService: IAuthorization
	) {}

	async execute(command: SaveSearchCommand) {
		const { appliedFilters, locationRecord, street, sendFrequency } = command;

		const apiBodyParams = SaveSearchMapper.toApiRequest(command);

		try {
			const response = await this.subscriberService.saveSearchListingSrPage(apiBodyParams);

			if (response.success) {
				this.toasterService.customToaster('The search has been saved.', 'success');

				this.srAnalyticsService.trackSaveSearchInteraction(
					appliedFilters,
					locationRecord,
					street,
					sendFrequency
				);
			}
			return response;
		} catch (error: any) {
			if (error.statusCode === 401) {
				return this.authorizedService.handle401Error(error.message);
			} else {
				return this.toasterService.customToaster(error.message, 'error');
			}
		}
	}
}
