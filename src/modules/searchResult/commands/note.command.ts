import { EListingEntityType } from '@realestateview/avesta-js-core';
import { EAnalyticsEventCategory } from '@shared/types/matomo';

export type DeleteNoteCommand = {
	noteId: number;
	propertyId: number;
	eventCategory: EAnalyticsEventCategory;
	note: string;
	childNote?: string | undefined;
	childId?: number;
};

export type SaveNoteCommand = {
	note: string;
	entityType: EListingEntityType;
	propertyId: number;
	eventCategory: EAnalyticsEventCategory;
	childId?: number;
};
