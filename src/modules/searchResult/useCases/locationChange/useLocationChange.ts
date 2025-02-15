import { useServices } from '@shared/hooks/useServices';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { LocationChangeCommand } from '@searchResult/commands/locationChange.command';
import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import { ELocationGroupId } from '@searchResult/types/enums';

export const useLocationChange = () => {
	const { locationChangeUseCase } = useServices();

	const stateManager = getStateManager();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setIsFrom = stateManager.useSetIsFrom();

	const appliedFilters = stateManager.useAppliedFilters();

	const execute = async (command: LocationChangeCommand) => {
		setSrPageLoading(command.selectedLocations[0].groupId, true);

		const filters = {
			...appliedFilters,
			page: 1
		};

		const locationChangeResponse = await locationChangeUseCase.execute({
			...command,
			appliedFilters: filters
		});

		if (locationChangeResponse) {
			setListingSrResponse(locationChangeResponse.response.data as unknown as TListingSrPageResponse);

			setSrPageUrl(locationChangeResponse.url);

			locationChangeResponse.filters && setAppliedFilters(locationChangeResponse.filters);

			locationChangeResponse.fromModuleType && setIsFrom(locationChangeResponse.fromModuleType);
		}

		setSrPageLoading(command.selectedLocations[0].groupId, false);
	};

	const setSrPageLoading = (groupId: string | undefined, isLoading: boolean) => {
		if (groupId !== ELocationGroupId.PROPERTY && groupId !== ELocationGroupId.PROJECT) {
			setIsListingSrLoading(isLoading);
			setIsMapSrLoading(isLoading);
		}
	};
	return { execute };
};
