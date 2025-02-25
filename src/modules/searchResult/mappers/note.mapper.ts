import { TListing, TPinListing, TProperties } from '@listingSr/core/types/listingSrTypes';
import { EListingEntityType } from '@realestateview/avesta-js-core';
import { SaveNote } from '@searchResult/types/types';

interface UpdateListingsQuery {
	listings: TListing[];
	note: string;
	noteId: number;
	propertyId: number;
	childId?: number;
}

interface UpdatePinsQuery {
	pins: TPinListing[];
	note: string;
	noteId: number;
	pinId: number;
}

export class NoteMapper {
	static toSaveNote(note: string, entityType: EListingEntityType, childId?: number) {
		const saveNoteData: SaveNote = {
			note,
			entityType
		};
		if (childId) {
			saveNoteData.entityType = EListingEntityType.project;
			saveNoteData.projectPropertiesId = childId;
		}
		return saveNoteData;
	}

	static applyNoteToListings({ listings, note, noteId, propertyId, childId }: UpdateListingsQuery): TListing[] {
		return listings.map((listing) => this.updateListing(listing, note, noteId, propertyId, childId));
	}

	static applyNoteToPins({ pins, note, noteId, pinId }: UpdatePinsQuery): TPinListing[] {
		return pins.map((pin) => (pin.id === pinId ? { ...pin, ...this.createNoteData(note, noteId) } : pin));
	}

	private static updateListing(
		listing: TListing,
		note: string,
		noteId: number,
		propertyId: number,
		childId?: number
	): TListing {
		if (listing.id === propertyId && !childId) {
			return { ...listing, ...this.createNoteData(note, noteId) };
		}

		return {
			...listing,
			properties: this.updateProperties(listing.properties, note, noteId, childId)
		};
	}

	private static updateProperties(
		properties: TProperties[] | undefined,
		note: string,
		noteId: number,
		childId?: number
	): TProperties[] | undefined {
		return properties?.map((property) =>
			property.id === childId ? { ...property, ...this.createNoteData(note, noteId) } : property
		);
	}

	private static createNoteData(note: string, noteId: number) {
		return {
			isShortListed: true,
			note,
			noteId
		};
	}
}
