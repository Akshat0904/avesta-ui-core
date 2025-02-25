import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { DeleteNoteCommand, SaveNoteCommand } from '@searchResult/commands/note.command';
import { NoteMapper } from '@searchResult/mappers/note.mapper';
import { useServices } from '@shared/hooks/useServices';

export const useNote = () => {
	const { deleteNoteUseCase, saveNoteUseCase } = useServices();

	const stateManager = getStateManager();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const listingSrResponse = stateManager.useListingSrResponse();

	const executeSaveNote = async (command: SaveNoteCommand) => {
		const { note, propertyId, childId } = command;
		const saveNoteResponse = await saveNoteUseCase.execute(command);

		if (saveNoteResponse) {
			const updatedPins = NoteMapper.applyNoteToPins({
				pins: listingSrResponse.pins,
				note: note,
				noteId: saveNoteResponse.noteId,
				pinId: propertyId
			});

			const updatedListings = NoteMapper.applyNoteToListings({
				listings: listingSrResponse.listings,
				note: note,
				noteId: saveNoteResponse.noteId,
				propertyId,
				childId
			});

			setListingSrResponse({
				...listingSrResponse,
				listings: updatedListings,
				pins: updatedPins
			});

			return saveNoteResponse;
		}
	};

	const executeDeleteNote = async (command: DeleteNoteCommand) => {
		const { propertyId, childId } = command;

		const deleteNoteResponse = await deleteNoteUseCase.execute({ ...command });
		if (deleteNoteResponse) {
			const updatedPins = NoteMapper.applyNoteToPins({
				pins: listingSrResponse.pins,
				note: '',
				noteId: 0,
				pinId: propertyId
			});
			const updatedListings = NoteMapper.applyNoteToListings({
				listings: listingSrResponse.listings,
				note: '',
				noteId: 0,
				propertyId,
				childId
			});

			setListingSrResponse({
				...listingSrResponse,
				listings: updatedListings,
				pins: updatedPins
			});

			return deleteNoteResponse;
		}
		return {
			success: false
		};
	};

	return { executeSaveNote, executeDeleteNote };
};
