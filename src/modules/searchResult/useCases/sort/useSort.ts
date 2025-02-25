import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { SortCommand } from '@searchResult/commands/sort.command';
import { getSelectedLocationNameFromResponse } from '@searchResult/shared/utils';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { useServices } from '@shared/hooks/useServices';

export const useSort = () => {
	const { sortUseCase } = useServices();
	const stateManager = getStateManager();

	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const srMapInstance = stateManager.useSrMapInstance();
	const listingSrResponse = stateManager.useListingSrResponse();

	const execute = async (command: SortCommand) => {
		setIsListingSrLoading(true);
		setIsMapSrLoading(true);

		const response = await sortUseCase.execute({
			...command,
			srMapInstance,
			listingSrResponse: listingSrResponse as unknown as ListingSrPageResponse
		});

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
