import { useServices } from '@shared/hooks/useServices';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { MarkerClickCommand } from '@searchResult/commands/markerClick.command';
import { EAccessDeviceType } from '@shared/types/enums';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';

export const useMarkerClick = () => {
	const { markerClickUseCase } = useServices();
	const stateManager: IListingSrState = getStateManager();

	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setIsShowSchoolDisclaimer = stateManager.useSetIsShowSchoolDisclaimer();
	const setPreviewSelection = stateManager.useSetPreviewSelection();
	const setIsCollapseBottomSheet = stateManager.useSetIsCollapseBottomSheet();
	const listingSrResponse = stateManager.useListingSrResponse();
	const deviceType = stateManager.useDeviceType();

	const executeMarkerClick = async (command: MarkerClickCommand) => {
		const { selectedMarker } = command;

		setIsShowSchoolDisclaimer(false);
		setIsCollapseBottomSheet(true);

		if (deviceType === EAccessDeviceType.MobileWeb) {
			setPreviewSelection(selectedMarker);
		}

		const response = await markerClickUseCase.execute({
			...command,
			deviceType,
			listingSrResponse: listingSrResponse as unknown as ListingSrPageResponse
		});

		setListingSrResponse(response as unknown as TListingSrPageResponse);
	};
	return { executeMarkerClick };
};
