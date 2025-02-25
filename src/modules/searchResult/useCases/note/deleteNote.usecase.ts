import { ListingAnalyticsService } from '@listingSr/core/services/analytics/listingAnalyticsService';
import { DeleteNoteCommand } from '@searchResult/commands/note.command';
import { IAuthorization } from '@shared/interfaces/authorization';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { SubscriberService } from '@shared/services/subscriberService';
import { EToastMsg } from '@shared/types/enums';
import { EAnalyticsEventAction, EAnalyticsEventCategory } from '@shared/types/matomo';

export class DeleteNoteUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private authorizedService: IAuthorization,
		private toasterService: IToasterService,
		private listingAnalyticsService: ListingAnalyticsService
	) {}
	async execute(command: DeleteNoteCommand) {
		const { noteId, eventCategory, note, childNote } = command;
		try {
			const removeNoteFromListingResponse = await this.subscriberService.removeNoteFromListing({
				subscriberListingId: noteId
			});

			if (removeNoteFromListingResponse && removeNoteFromListingResponse.success && Boolean(noteId)) {
				this.trackNoteEvent(note, EAnalyticsEventAction.DeleteNote, eventCategory);
				childNote && this.trackNoteEvent(childNote, EAnalyticsEventAction.DeleteNote, eventCategory);

				this.toasterService.customToaster(EToastMsg.noteDeletedSuccessfully, 'success');

				return { success: true };
			}
		} catch (error: any) {
			if (error.statusCode === 401) {
				this.authorizedService.handle401Error(error.message);
			} else {
				this.toasterService.customToaster(error.message, 'error');
			}
		}
	}

	private trackNoteEvent = (
		note: string | undefined,
		actionName: EAnalyticsEventAction,
		eventCategory: EAnalyticsEventCategory
	) => {
		if (!eventCategory || !note) {
			return;
		}
		this.listingAnalyticsService.saveOrDeleteNoteTrackEvent(eventCategory, actionName, note);
	};
}
