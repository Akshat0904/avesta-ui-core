import { useServices } from '@shared/hooks/useServices';
import { EAccessDeviceType } from '@shared/types/enums';
import { usePageChange } from './usePageChange';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { IListingSrState } from '@listingSr/core/types/listingSrState';

export const usePaginationInfo = () => {
	const { updateListingsOnPageChange } = usePageChange();

	const stateManager: IListingSrState = getStateManager();

	const srMapInstance = stateManager.useSrMapInstance();
	const listingSrResponse = stateManager.useListingSrResponse();
	const isListingSrLoading = stateManager.useIsListingSrLoading();
	const appliedFilters = stateManager.useAppliedFilters();
	const deviceType = stateManager.useDeviceType();

	const { listingSrService } = useServices();

	const { pinsTotal, size } = listingSrResponse;

	const { listings } = listingSrResponse;

	const shouldShowPagination = () => {
		if (
			!listingSrResponse ||
			!listings ||
			listingSrService.getTotalPaginationTilesForSrListing(pinsTotal, size) <= 1 ||
			isListingSrLoading ||
			listingSrResponse.appliedFilters
		) {
			return false;
		}
		return true;
	};

	const getActivePage = () => {
		return appliedFilters.page || 1;
	};

	const onPageChange = (pageNumber: number) => {
		if (deviceType === EAccessDeviceType.Desktop && srMapInstance) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}

		updateListingsOnPageChange(pageNumber);
	};
	return {
		getActivePage,
		shouldShowPagination,
		onPageChange
	};
};
