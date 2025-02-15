import { useServices } from '@shared/hooks/useServices';
import { useSharedService } from '@shared/hooks/useSharedService';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';

export const usePageChange = () => {
	const { listingSrService } = useServices();
	const { toasterService } = useSharedService();

	const stateManager: IListingSrState = getStateManager();

	const listingSrResponse = stateManager.useListingSrResponse();
	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const appliedFilters = stateManager.useAppliedFilters();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const deviceType = stateManager.useDeviceType();
	const isFrom = stateManager.useIsFrom();

	const { size, pins } = listingSrResponse;

	const updateListingsOnPageChange = async (pageNumber: number) => {
		const pinsData = listingSrService.getPinsForPage(pageNumber, size, pins);
		if (!pinsData || !pinsData.length) {
			return;
		}
		setIsListingSrLoading(true);
		const pinsIds = pinsData.map((aPinDetails) => aPinDetails.id);
		const listingParams = {
			listingIds: pinsIds,
			saleMethod: appliedFilters.saleMethod[0]
		};

		const filters = {
			...appliedFilters,
			page: pageNumber
		};

		const { zoom, pageType, ...restFilters } = filters;

		const url = listingSrService.getUrlFromListingSrData(isFrom, restFilters);

		try {
			const response = await listingSrService.getListingsByIds(deviceType, filters, listingParams, url || '');

			const filteredProjectChildProperties = listingSrService.modifyProjectProfileChildProperties(
				response.data,
				filters
			);

			setAppliedFilters(filters);
			setListingSrResponse({
				...listingSrResponse,
				listings: filteredProjectChildProperties
			});

			if (!url) {
				return;
			}
			setSrPageUrl(url);
		} catch (error: any) {
			toasterService.customToaster(error.message, 'error');
		} finally {
			setIsListingSrLoading(false);
		}
	};

	return {
		updateListingsOnPageChange
	};
};
