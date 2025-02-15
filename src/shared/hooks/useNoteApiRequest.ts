import { useState } from 'react';
import { useSharedService } from './useSharedService';
import { TAddEditNoteBodyParams } from '@shared/types/types';

export const useNoteApiRequest = () => {
	const { toasterService, subscriberService, authorizedService } = useSharedService();

	const [loading, setLoading] = useState<boolean>(false);

	const deleteNote = async (noteId: number) => {
		setLoading(true);
		try {
			return await subscriberService.removeNoteFromListing({ subscriberListingId: noteId });
		} catch (error: any) {
			if (error.statusCode === 401) {
				setLoading(false);
				authorizedService.handle401Error(error.message);
			} else {
				toasterService.customToaster(error.message, 'error');
			}
		}
	};

	const editOrSaveNote = async (requestBody: TAddEditNoteBodyParams, id: number) => {
		setLoading(true);
		try {
			return await subscriberService.addNoteToProperty(requestBody, id);
		} catch (error: any) {
			setLoading(false);
			if (error.statusCode === 401) {
				authorizedService.handle401Error(error.message);
			} else {
				toasterService.customToaster(error.message, 'error');
			}
		}
	};

	return { editOrSaveNote, deleteNote, loading };
};
