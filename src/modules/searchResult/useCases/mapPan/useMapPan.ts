import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { MapPanCommand } from '@searchResult/commands/mapPan.command';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import { useServices } from '@shared/hooks/useServices';
import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';

export const useMapPan = () => {
	const { mapPanUseCase } = useServices();
	const stateManager: IListingSrState = getStateManager();

	const srMapInstance = stateManager.useSrMapInstance();
	const deviceType = stateManager.useDeviceType();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const appliedFilters = stateManager.useAppliedFilters();
	const isFrom = stateManager.useIsFrom();

	const execute = async (command: MapPanCommand) => {
		const { firstMapMove } = command;

		if (deviceType === EAccessDeviceType.Desktop) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}

		setIsMapSrLoading(true);
		setIsListingSrLoading(true);
		setSelectedLocationName(['Map Area']);

		const response = await mapPanUseCase.execute({
			filters: appliedFilters,
			srMapInstance,
			fromModuleType: isFrom,
			deviceType,
			firstMapMove
		});

		setSrPageUrl(response!.url);
		setAppliedFilters(response!.filters!);
		setListingSrResponse(response!.response.data as unknown as TListingSrPageResponse);
		setIsMapSrLoading(false);
		setIsListingSrLoading(false);
	};

	return { execute };
};
