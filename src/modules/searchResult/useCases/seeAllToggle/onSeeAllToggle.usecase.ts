import { SortFilterHandler } from '@searchResult/services/sortFilterHandler.service';
import { onSeeAllToggleCommand } from '@searchResult/commands/onSeeAllToggle.command';
import { EAccessDeviceType } from '@shared/types/enums';
import { SrFilter } from '@searchResult/types/types';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';

export class OnSeeAllToggleUseCase extends SortFilterHandler {
	async execute(command: onSeeAllToggleCommand) {
		const { srMapInstance, filters } = command;

		if (srMapInstance) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}

		const onSeeAllToggleResponse = await this.handle(command);

		if (onSeeAllToggleResponse && onSeeAllToggleResponse.response.data) {
			this.srAnalyticsService.trackSeeAllButtonInteraction(
				filters,
				onSeeAllToggleResponse.response.data.locationESRecords,
				onSeeAllToggleResponse.response.data.streetESRecords
			);
		}

		return onSeeAllToggleResponse;
	}

	protected trackPageViewEvents(
		deviceType: EAccessDeviceType,
		aFilters: SrFilter,
		listingSrResponse: ListingSrPageResponse,
		url: string
	) {
		return;
	}

	protected trackFilterSearchInteractionEvent(filters: SrFilter) {
		return;
	}
}
