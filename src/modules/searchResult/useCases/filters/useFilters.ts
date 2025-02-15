import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { getSelectedLocationNameFromSrPageResponse } from '@listingSr/presentation/utils/utils';
import { FiltersCommand } from '@searchResult/commands/filters.command';
import { getSelectedLocationNameFromResponse } from '@searchResult/shared/utils';
import { useServices } from '@shared/hooks/useServices';

export const useFilters = () => {
	const { filtersUseCase } = useServices();
	const stateManager = getStateManager();

	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setPreviewSelection = stateManager.useSetPreviewSelection();
	const srMapInstance = stateManager.useSrMapInstance();
	const deviceType = stateManager.useDeviceType();

	const execute = async (command: FiltersCommand) => {
		setIsListingSrLoading(true);
		setIsMapSrLoading(true);

		if (srMapInstance) {
			setPreviewSelection([]);
			srMapInstance.removeOverlaysToolTip('overlay-reference');
		}

		const response = await filtersUseCase.execute({ ...command, srMapInstance, deviceType });

		setSrPageUrl(response!.url);
		setAppliedFilters(response!.filters!);
		setListingSrResponse(response!.response.data as unknown as TListingSrPageResponse);

		const displayTexts = getSelectedLocationNameFromResponse(response!.response.data);

		setSelectedLocationName([displayTexts[0]]);
		setIsListingSrLoading(false);
		setIsMapSrLoading(false);
	};

	return { execute };
};
