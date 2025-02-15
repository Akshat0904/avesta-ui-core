import { useState } from 'react';
import { useServices } from '@shared/hooks/useServices';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { ShortlistMapper } from '@searchResult/mappers/shortlist.mapper';
import { ShortlistCommand } from '@searchResult/commands/shortlist.command';

export const useShortlist = () => {
	const { addShortlistUseCase, removeShortlistUseCase } = useServices();

	const [loading, setLoading] = useState<boolean>(false);

	const stateManager = getStateManager();

	const listingSrResponse = stateManager.useListingSrResponse();
	const setListingSrResponse = stateManager.useSetListingSrResponse();

	const executeAddShortlist = async (command: ShortlistCommand) => {
		setLoading(true);

		await addShortlistUseCase.execute(command);

		const updatedP360Property = ShortlistMapper.getUpdatedP360Properties({
			...command,
			listingSrResponse,
			isShortListed: true
		});

		const updatedListings = ShortlistMapper.getUpdatedListing({
			...command,
			listingSrResponse,
			isShortListed: true
		});

		const updatedPins = ShortlistMapper.getUpdatedPins({ ...command, listingSrResponse, isShortListed: true });

		setListingSrResponse({
			...listingSrResponse,
			listings: updatedListings,
			pins: updatedPins,
			p360Properties: {
				...listingSrResponse.p360Properties,
				data: updatedP360Property
			}
		});

		setLoading(false);
	};

	const executeRemoveShortlist = async (command: ShortlistCommand) => {
		setLoading(true);

		await removeShortlistUseCase.execute(command);

		const updatedP360Property = ShortlistMapper.getUpdatedP360Properties({
			...command,
			listingSrResponse,
			isShortListed: false
		});

		const updatedListings = ShortlistMapper.getUpdatedListing({
			...command,
			listingSrResponse,
			isShortListed: false
		});

		const updatedPins = ShortlistMapper.getUpdatedPins({ ...command, listingSrResponse, isShortListed: false });

		updatedListings.forEach((listing) => {
			listing.noteId = 0;
			listing.note = '';
		});

		setListingSrResponse({
			...listingSrResponse,
			listings: updatedListings,
			pins: updatedPins,
			p360Properties: {
				...listingSrResponse.p360Properties,
				data: updatedP360Property
			}
		});

		setLoading(false);
	};

	return { executeRemoveShortlist, executeAddShortlist, loading };
};
