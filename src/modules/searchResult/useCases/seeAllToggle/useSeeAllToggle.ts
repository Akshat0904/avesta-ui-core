import { useRef } from 'react';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { useServices } from '@shared/hooks/useServices';
import { OffSeeAllToggleUseCase } from '@searchResult/useCases/seeAllToggle/offSeeAllToggle.usecase';
import { getSelectedLocationNameFromResponse } from '@searchResult/shared/utils';
import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';

export const useSeeAllToggle = () => {
	const { onSeeAllToggleUseCase } = useServices();

	const aValueRef = useRef(false);

	const stateManager: IListingSrState = getStateManager();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setToggleSeeAll = stateManager.useSetToggleSeeAll();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const listingSrResponse = stateManager.useListingSrResponse();
	const appliedFilters = stateManager.useAppliedFilters();
	const srMapInstance = stateManager.useSrMapInstance();
	const deviceType = stateManager.useDeviceType();
	const isFrom = stateManager.useIsFrom();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();

	const executeOnSeeAllToggle = async (aValue: boolean) => {
		aValueRef.current = aValue;

		setToggleSeeAll(true);
		setIsListingSrLoading(true);
		setIsMapSrLoading(true);

		const seeAllToggleQuery = {
			filters: {
				...appliedFilters,
				includeP360Properties: aValueRef.current
			},
			fromModuleType: isFrom,
			deviceType,
			srMapInstance,
			listingSrResponse: listingSrResponse as unknown as ListingSrPageResponse
		};

		const getOnSeeAllResponse = await onSeeAllToggleUseCase.execute(seeAllToggleQuery);

		if (getOnSeeAllResponse) {
			setSrPageUrl(getOnSeeAllResponse.url);
			setListingSrResponse(getOnSeeAllResponse.response.data as unknown as TListingSrPageResponse);
			setAppliedFilters(getOnSeeAllResponse.filters!);
			const displayTexts = getSelectedLocationNameFromResponse(getOnSeeAllResponse.response.data);
			setSelectedLocationName([displayTexts[0]]);
		}
		setIsListingSrLoading(false);
		setIsMapSrLoading(false);
	};

	const executeOffSeeAllToggle = (aValue: boolean) => {
		aValueRef.current = aValue;
		setToggleSeeAll(false);
		const getOffSeeAllResponse = OffSeeAllToggleUseCase.execute({ listingSrResponse, srMapInstance });
		setAppliedFilters({ ...appliedFilters, includeP360Properties: aValueRef.current });
		return setListingSrResponse(getOffSeeAllResponse);
	};

	return { executeOnSeeAllToggle, executeOffSeeAllToggle };
};
