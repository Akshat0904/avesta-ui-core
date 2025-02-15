import {
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import { useServices } from '@shared/hooks/useServices';
import { TListingSrResponse } from '../../core/types/listingSrTypes';
import { getSelectedLocationNameFromSrPageResponse } from '../utils/utils';
import { useListingsByGridIds } from './useListingsByGridIds';
import { useSharedService } from '@shared/hooks/useSharedService';
import getStateManager from '../stateManagement/stateManagementFactory';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import { EModuleType } from '@shared/types/enums';
import { getRecentSearchesTab } from '@searchResult/shared/utils';

export const useListingSrFilters = () => {
	const stateManager: IListingSrState = getStateManager();

	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const appliedFilters = stateManager.useAppliedFilters();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const toggleSeeAll = stateManager.useToggleSeeAll();
	const deviceType = stateManager.useDeviceType();
	const isFrom = stateManager.useIsFrom();

	const { retrieveListingsByGridIds } = useListingsByGridIds();

	const { listingSrService, listingSrServiceWithNullAnalyticsService, srCacheService } = useServices();

	const { listingService, subscriberService, recentSearchService } = useSharedService();

	// useEffect(() => {
	// 	if (isSortChange !== false) {
	// 		onFilterChange(appliedFilters);

	// 		setIsSortChange(false);
	// 	}
	// },  [isSortChange, appliedFilters]);
	const onFilterChange = async (
		aFilters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		type: EModuleType,
		pageNo?: number
	) => {
		// Need to clear the cache so that it doesn't show stale data
		srCacheService.clear();

		const latestFilters = {
			...aFilters,
			...(aFilters.includeP360Properties && { includeP360Properties: aFilters.includeP360Properties }),
			...(aFilters.zoom && { zoom: aFilters.zoom }),
			page: pageNo || 1
		};
		let responseInfo;
		let aFiltersDetails;
		if (listingService.checkLocationsInUrlData(aFilters)) {
			const { size, zoom, pageType, ...restAppliedFilters } = latestFilters;
			setIsListingSrLoading(true);
			setIsMapSrLoading(true);
			const url = listingSrService.getUrlFromListingSrData(isFrom, {
				...restAppliedFilters,
				...(appliedFilters.pageType !== ESchoolCatchmentSrPageType.listing && {
					pageType: appliedFilters.pageType
				})
			});
			if (url) {
				try {
					const service = toggleSeeAll ? listingSrServiceWithNullAnalyticsService : listingSrService;

					const response: TListingSrResponse = await service.getSearchListingsByLocation(
						deviceType,
						{
							...restAppliedFilters,
							...((isFrom === EModuleType.PROJECT ||
								(aFilters.pageType && aFilters.pageType === ESchoolCatchmentSrPageType.project)) && {
								onlyProject: true
							})
						},
						url
					);
					responseInfo = response;
					aFiltersDetails = restAppliedFilters;
					setSrPageUrl(url);
					const displayTexts = getSelectedLocationNameFromSrPageResponse(response.data);
					setSelectedLocationName([displayTexts[0]]);

					const data = {
						displayName: displayTexts,
						pageUrl: url,
						filters: { pageType, ...restAppliedFilters },
						locations: restAppliedFilters.locations || []
					};

					!toggleSeeAll &&
						restAppliedFilters.locations &&
						restAppliedFilters.locations.length > 0 &&
						type !== EModuleType.PROJECT &&
						recentSearchService.addLocationToRecentSearches(
							getRecentSearchesTab(appliedFilters.saleMethod[0]),
							data
						);
				} catch (error) {
					throw error;
				}
			} else {
				throw new Error('URL not generated from UrlService');
			}
			if (!subscriberService.isLoggedIn()) {
				const updatedData = listingService.updatePropertiesWithRecentlyView(responseInfo.data);
				if (updatedData) {
					setListingSrResponse(updatedData);
				}
			} else {
				setListingSrResponse(responseInfo.data);
			}
			setIsListingSrLoading(false);
			setIsMapSrLoading(false);
		} else {
			await retrieveListingsByGridIds(aFilters);

			aFiltersDetails = aFilters;
		}

		setAppliedFilters({
			...aFiltersDetails,
			pageType: appliedFilters.pageType
		});
	};

	return { onFilterChange };
};
