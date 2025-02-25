import { ListingAnalyticsService } from '@listingSr/core/services/analytics/listingAnalyticsService';
import { SaveNoteCommand } from '@searchResult/commands/note.command';
import { NoteMapper } from '@searchResult/mappers/note.mapper';
import { IAuthorization } from '@shared/interfaces/authorization';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { SubscriberService } from '@shared/services/subscriberService';
import { EToastMsg } from '@shared/types/enums';
import { EAnalyticsEventAction, EAnalyticsEventCategory } from '@shared/types/matomo';

export class SaveNoteUseCase {
	constructor(
		private subscriberService: SubscriberService,
		private authorizedService: IAuthorization,
		private toasterService: IToasterService,
		private listingAnalyticsService: ListingAnalyticsService
	) {}

	async execute(command: SaveNoteCommand) {
		const { note, entityType, propertyId, eventCategory, childId } = command;
		const saveNoteBody = NoteMapper.toSaveNote(note, entityType, childId);
		try {
			const addNoteToPropertyResponse = await this.subscriberService.addNoteToProperty(saveNoteBody, propertyId);
			const noteId = addNoteToPropertyResponse.response.subscriberShortlistListingId;

			if (addNoteToPropertyResponse && addNoteToPropertyResponse.success && Boolean(noteId)) {
				this.trackNoteEvent(note, EAnalyticsEventAction.SaveNote, eventCategory);
				this.toasterService.customToaster(EToastMsg.noteAddedSuccessfully, 'success');

				return {
					isShortListed: true,
					note,
					noteId
				};
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
