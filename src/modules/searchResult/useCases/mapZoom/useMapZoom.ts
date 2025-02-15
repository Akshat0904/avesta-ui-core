import { useRef } from 'react';
import { useServices } from '@shared/hooks/useServices';
import { EAccessDeviceType } from '@shared/types/enums';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import { MapZoom, MapZoomCommand, MapZoomInCommand, MapZoomOutCommand } from '@searchResult/commands/mapZoom.command';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';

export const useMapZoom = () => {
	const { mapZoomInUseCase, mapZoomOutUseCase } = useServices();

	const stateManager: IListingSrState = getStateManager();

	const srMapInstance = stateManager.useSrMapInstance();
	const deviceType = stateManager.useDeviceType();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const appliedFilters = stateManager.useAppliedFilters();
	const isFrom = stateManager.useIsFrom();
	const listingSrResponse = stateManager.useListingSrResponse();
	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const preZoomLevel = useRef(0);

	const execute = async (command: MapZoomCommand) => {
		const { isFirstMapMove, previousZoomLevel } = command;

		if (!srMapInstance) {
			return;
		}

		setIsMapSrLoading(true);
		setIsListingSrLoading(true);
		setSelectedLocationName(['Map Area']);

		preZoomLevel.current = previousZoomLevel;
		const zoomLvl = srMapInstance.getCurrentZoomLevel() || 15;
		const currZoomLevel = Math.round(zoomLvl);

		const zoomCommand = {
			filters: appliedFilters,
			srMapInstance,
			fromModuleType: isFrom,
			deviceType,
			listingSrResponse: listingSrResponse as unknown as ListingSrPageResponse,
			isFirstMapMove: isFirstMapMove,
			zoom: currZoomLevel
		};

		let response;
		if (currZoomLevel > preZoomLevel.current) {
			response = await mapZoomInUseCase.execute(zoomCommand as MapZoomInCommand);
		} else {
			response = await mapZoomOutUseCase.execute(zoomCommand as MapZoomOutCommand);
		}

		setSrPageUrl(response.url);
		setAppliedFilters(response.filters);
		setListingSrResponse(response.response.data as unknown as TListingSrPageResponse);
		setIsMapSrLoading(false);
		setIsListingSrLoading(false);

		preZoomLevel.current = zoomLvl;
	};

	return { execute };
};
