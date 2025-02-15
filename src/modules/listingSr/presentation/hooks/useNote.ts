import { TListing, TPinListing } from '@listingSr/core/types/listingSrTypes';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '../stateManagement/stateManagementFactory';

export const useNote = () => {
	const stateManager: IListingSrState = getStateManager();

	const listingSrResponse = stateManager.useListingSrResponse();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const deleteNote = (propertyId: string, childId?: number) => {
		const updatedListings = updateListings('', 0, propertyId, childId);

		const updatedPins = listingSrResponse.pins.map((aListing) =>
			aListing.id.toString() === propertyId ? { ...aListing, note: '', noteId: 0 } : aListing
		);

		setListingSrResponse({
			...listingSrResponse,
			listings: updatedListings,
			pins: updatedPins
		});
	};

	const updateData = (updatedListings: TListing[], updatedPins: TPinListing[]) => {
		setListingSrResponse({
			...listingSrResponse,
			listings: updatedListings,
			pins: updatedPins
		});
	};

	const updatePins = (note: string, noteId: number, pinId: string): TPinListing[] => {
		return listingSrResponse.pins.map((pin) =>
			pin.id.toString() === pinId
				? {
						...pin,
						isShortListed: true,
						note,
						noteId
				  }
				: pin
		);
	};

	const isListingShortlisted = (id: number, propertyId: string, childId?: number) => {
		return id.toString() === propertyId && !childId;
	};

	const addNote = (note: string, noteId: number) => {
		return {
			isShortListed: true,
			note: note,
			noteId: noteId
		};
	};

	const updateChildListings = (aListing: TListing, note: string, noteId: number, childId?: number) => {
		return aListing.properties?.map((property) =>
			property.id === childId ? { ...property, ...addNote(note, noteId) } : property
		);
	};

	const updateParent = (aListing: TListing, note: string, noteId: number, propertyId: string, childId?: number) => {
		const { id } = aListing;

		if (isListingShortlisted(id, propertyId, childId)) {
			return { ...aListing, ...addNote(note, noteId) };
		}

		return {
			...aListing,
			properties: updateChildListings(aListing, note, noteId, childId)
		};
	};

	const updateListings = (note: string, noteId: number, propertyId: string, childId?: number) => {
		return listingSrResponse.listings.map((aListing) => updateParent(aListing, note, noteId, propertyId, childId));
	};

	const editOrSaveNote = (note: string, noteId: number, propertyId: string, childId?: number) => {
		if (!noteId) {
			return;
		}
		const updatedListings = updateListings(note, noteId, propertyId, childId);

		const updatedPins = updatePins(note, noteId, propertyId);

		updateData(updatedListings, updatedPins);
	};

	return { deleteNote, editOrSaveNote };
};
