import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { PageChangeCommand } from '@searchResult/commands/pageChange.command';
import { useServices } from '@shared/hooks/useServices';
import { EAccessDeviceType } from '@shared/types/enums';

export const usePageChange = () => {
	const { pageChangeUseCase } = useServices();

	const stateManager: IListingSrState = getStateManager();
	const srMapInstance = stateManager.useSrMapInstance();
	const listingSrResponse = stateManager.useListingSrResponse();
	const isListingSrLoading = stateManager.useIsListingSrLoading();
	const appliedFilters = stateManager.useAppliedFilters();
	const deviceType = stateManager.useDeviceType();
	const isFrom = stateManager.useIsFrom();

	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const setListingSrResponse = stateManager.useSetListingSrResponse();

	const showPagination = shouldShowPagination(listingSrResponse, isListingSrLoading);

	const activePage = appliedFilters.page || 1;

	const execute = async (command: PageChangeCommand) => {
		if (deviceType === EAccessDeviceType.Desktop && srMapInstance) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}
		setIsListingSrLoading(true);
		try {
			const pageChangeResponse = await pageChangeUseCase.execute({
				...command,
				listingSrResponse,
				appliedFilters,
				deviceType,
				isFrom
			});
			if (pageChangeResponse) {
				setAppliedFilters(pageChangeResponse.filters);
				setListingSrResponse({
					...listingSrResponse,
					listings: pageChangeResponse.listings
				});
				pageChangeResponse.url && setSrPageUrl(pageChangeResponse.url);
			}
			setIsListingSrLoading(false);
		} catch {
			setIsListingSrLoading(false);
		} finally {
			setIsListingSrLoading(false);
		}
	};

	function shouldShowPagination(listingSrResponse, isListingSrLoading) {
		return (
			listingSrResponse &&
			listingSrResponse.listings &&
			getTotalPaginationTilesForSrListing(listingSrResponse.pinsTotal, listingSrResponse.size) > 1 &&
			!isListingSrLoading &&
			!listingSrResponse.appliedFilters
		);
	}

	function getTotalPaginationTilesForSrListing(pinsTotal: number, size: number) {
		return Math.ceil(pinsTotal / size);
	}

	return {
		execute,
		showPagination,
		activePage
	};
};
