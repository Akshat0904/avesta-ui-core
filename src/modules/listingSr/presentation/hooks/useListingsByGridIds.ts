import {
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import { useServices } from '@shared/hooks/useServices';
import { MapGridService } from '@shared/services/mapGridService';
import { EModuleType, EToastMsg } from '@shared/types/enums';
import { TGridDetails } from '@listingSr/core/types/listingSrTypes';
import { useSharedService } from '@shared/hooks/useSharedService';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '../stateManagement/stateManagementFactory';
export const useListingsByGridIds = () => {
	const { listingSrService, geoSpatialService, listingSrServiceWithNullAnalyticsService, boundingBoxService } =
		useServices();

	const { listingService, subscriberService, toasterService } = useSharedService();

	const stateManager: IListingSrState = getStateManager();

	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const srMapInstance = stateManager.useSrMapInstance();
	const toggleSeeAll = stateManager.useToggleSeeAll();
	const deviceType = stateManager.useDeviceType();
	const isFrom = stateManager.useIsFrom();

	const getPageUrl = (appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData) => {
		const listingSrMapGridService = new MapGridService(srMapInstance, geoSpatialService, boundingBoxService);

		const formattedBoundingBox = listingSrMapGridService.formatBoundingBox(boundingBoxService.getBoundingBox());

		const bBoxData = {
			topLeftLatitude: formattedBoundingBox.topLeftLatitude,
			topLeftLongitude: formattedBoundingBox.topLeftLongitude,
			bottomRightLatitude: formattedBoundingBox.bottomRightLatitude,
			bottomRightLongitude: formattedBoundingBox.bottomRightLongitude
		};

		const newAppliedFilters = {
			...appliedFilters,
			page: 1,
			...bBoxData
		};

		const { zoom, size, locations, pageType, ...restAppliedFilters } = newAppliedFilters;
		setAppliedFilters({ zoom, ...restAppliedFilters, pageType });

		const url = listingSrService.getUrlFromListingSrData(isFrom, {
			...restAppliedFilters,
			...(pageType !== ESchoolCatchmentSrPageType.listing && { pageType })
		});

		if (!url) {
			return;
		}

		setSelectedLocationName(['Map Area']);

		setSrPageUrl(url);
		return restAppliedFilters;
	};

	const retrieveListingsByGridIds = async (appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData) => {
		try {
			if (!srMapInstance) {
				console.error('Map instance is not yet defined');
				return;
			}
			const filters = getPageUrl(appliedFilters);
			setIsMapSrLoading(true);
			setIsListingSrLoading(true);
			if (!filters) {
				return;
			}
			const listingSrMapGridService = new MapGridService(srMapInstance, geoSpatialService, boundingBoxService);

			const gridResult = await listingSrMapGridService.getGrids();

			const bodyParams: IListingSrData & TGridDetails = {
				...filters,
				page: 1,
				...(gridResult &&
					gridResult.gridIds &&
					gridResult.gridIds.length > 0 && { gridIds: gridResult.gridIds }),
				...(gridResult && gridResult.gridLevel && { gridLevel: gridResult.gridLevel }),
				saleMethod: appliedFilters.saleMethod,
				zoom: appliedFilters.zoom,
				...((isFrom === EModuleType.PROJECT ||
					appliedFilters.pageType === ESchoolCatchmentSrPageType.project) && { onlyProject: true })
			};

			const url = listingSrService.getUrlFromListingSrData(isFrom, {
				...filters,
				pageType: appliedFilters.pageType
			});

			if (!url) {
				return;
			}

			const service = toggleSeeAll ? listingSrServiceWithNullAnalyticsService : listingSrService;

			const response = await service.getListingsByGridIds(deviceType, filters, bodyParams, url || '');
			if (!response) {
				return;
			}
			if (!response.success) {
				throw response.message;
			}
			if (response && response.data) {
				const updatedData = !subscriberService.isLoggedIn()
					? listingService.updatePropertiesWithRecentlyView(response.data)
					: response.data;

				if (updatedData) {
					setListingSrResponse(updatedData);
				}
			}
		} catch (error) {
			toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
		} finally {
			setIsMapSrLoading(false);
			setIsListingSrLoading(false);
		}
	};

	return { retrieveListingsByGridIds, getPageUrl };
};
