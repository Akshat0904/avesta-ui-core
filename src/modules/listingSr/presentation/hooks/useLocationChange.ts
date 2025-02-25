import { EAppsPageType, EModuleType, EToastMsg } from '@shared/types/enums';
import { removeObjectKeys } from '@shared/utils/utils';
import { useServices } from '@shared/hooks/useServices';
import {
	TLocationSearchResponse,
	TPropertyLocationDetails,
	TSelectedSearch,
	TStreetDetails
} from '@shared/types/types';
import { TListingSrPageResponse, TSelectedLocation, ISchoolInfoEsRes } from '../../core/types/listingSrTypes';
import { useSharedService } from '@shared/hooks/useSharedService';
import { ESchoolCatchmentSrPageType, UrlService } from '@realestateview/avesta-js-core';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '../stateManagement/stateManagementFactory';
import { getSelectedLocationNameFromSrPageResponse } from '../utils/utils';

export const useLocationChange = () => {
	const stateManager: IListingSrState = getStateManager();

	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const appliedFilters = stateManager.useAppliedFilters();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const setIsListingSrLoading = stateManager.useSetIsListingSrLoading();
	const setIsMapSrLoading = stateManager.useSetIsMapSrLoading();
	const setSelectedLocationName = stateManager.useSetSelectedLocationName();
	const setSrPageUrl = stateManager.useSetSrPageUrl();
	const deviceType = stateManager.useDeviceType();
	const isFrom = stateManager.useIsFrom();
	const setIsFrom = stateManager.useSetIsFrom();
	// const { addPropertyToRecentSearch, addLocationToRecentSearch } = useRecentSearch();

	const { listingSrService, priceEstimatorService, srCacheService, analyticsManagerService } = useServices();

	const { navigationService, subscriberService, toasterService, storageService, listingService } = useSharedService();

	const handleRecentlyViewedUpdates = (listingResponse: TListingSrPageResponse) => {
		let updatedResponse = listingResponse;
		if (!subscriberService.isLoggedIn()) {
			const recentlyViewedProperties = storageService.getItem('__view_recently_viewed');
			if (!recentlyViewedProperties) {
				return updatedResponse;
			} else {
				updatedResponse = listingService.updatePropertiesWithRecentlyView(listingResponse);
			}
		}
		return updatedResponse;
	};
	const getAppsPageType = (isFrom: EModuleType) => {
		return appliedFilters.pageType === ESchoolCatchmentSrPageType.project || isFrom === EModuleType.PROJECT
			? EAppsPageType.NewDevSr
			: EAppsPageType.ListingSr;
	};

	const onLocationChange = async (
		searchKeyword: string,
		selectedLocation: TSelectedSearch[],
		type: EModuleType,
		screenName?: string,
		props?: Record<string, any>
	) => {
		// Need to clear the cache so that it doesn't show stale data
		srCacheService.clear();

		if (!selectedLocation[0]) return;

		setIsFrom(
			appliedFilters.pageType === ESchoolCatchmentSrPageType.project || isFrom === EModuleType.PROJECT
				? EModuleType.PROJECT
				: EModuleType.HOME
		);

		const appsPageType = getAppsPageType(isFrom);

		analyticsManagerService.set(appsPageType);

		try {
			setSelectedLocationName([selectedLocation[0].displayName]);
			const urlData = removeObjectKeys(appliedFilters, [
				'bottomRightLatitude',
				'bottomRightLongitude',
				'topLeftLongitude',
				'topLeftLatitude'
			]);
			const { zoom, ...restFilters } = urlData;
			let newResponse;
			if (selectedLocation[0].groupId === 'school') {
				setIsFrom(EModuleType.SCHOOL);
				analyticsManagerService.set(EAppsPageType.SchoolSr);

				const { state_code, suburb, postcode, full_name, state, schoolName, suburbName } = selectedLocation[0]
					.value as ISchoolInfoEsRes;

				const detailData = {
					...restFilters,
					locations: [
						{
							state: state_code ? state_code : state,
							suburbName: suburb ?? suburbName,
							postcode: postcode || '',
							schoolName: full_name ?? schoolName
						}
					],
					pageType: type === EModuleType.PROJECT ? ESchoolCatchmentSrPageType.project : restFilters.pageType
				};
				detailData.pageType === ESchoolCatchmentSrPageType.listing && delete detailData.pageType;

				const url = UrlService.SchoolCatchmentSr.getUrlFromSchoolCatchmentSrData(detailData);

				if (!url) {
					return;
				}

				const selectedLocationDetails = selectedLocation as TSelectedLocation[];
				// const locations = getLocationsDetails(selectedLocation as TSelectedSearch[], true);
				const locationDetails = selectedLocationDetails.map((location) => location && location.value);

				setIsListingSrLoading(true);
				setIsMapSrLoading(true);
				const { response, newFilters } = await listingSrService.handleLocationChangeWithArray(
					selectedLocationDetails,
					restFilters,
					deviceType,
					searchKeyword,
					isFrom
				);

				// const { response, newFilters } = await locationChangeUseCase.execute({
				// 	appliedFilters,
				// 	deviceType,
				// 	selectedLocation,
				// 	searchKeyword,
				// 	isFrom
				// });
				// addLocationToRecentSearch(
				// 	[selectedLocation[0].displayName],
				// 	url,
				// 	appliedFilters,
				// 	locationDetails,
				// 	type
				// );

				newResponse = response.data;
				setAppliedFilters({
					...newFilters,
					pageType: type === EModuleType.PROJECT ? ESchoolCatchmentSrPageType.project : restFilters.pageType
				});
				setSrPageUrl(url);
				const updatedResponse = handleRecentlyViewedUpdates(newResponse);
				setListingSrResponse(updatedResponse);
				return;
			}

			if (selectedLocation[0].groupId === 'project') {
				const projectData = selectedLocation[0].value as TLocationSearchResponse;
				const detailData = {
					state: projectData.state,
					suburbName: projectData.suburbName || '',
					postcode: projectData.postcode || '',
					projectSlug: projectData.projectSlug || ''
				};

				const url = UrlService.ProjectDetail.getUrlFromProjectDetailData(detailData);
				// addLocationToRecentSearch(
				// 	[selectedLocation[0].displayName],
				// 	url,
				// 	appliedFilters,
				// 	[selectedLocation[0].value],
				// 	type
				// );
				if (!url) {
					return;
				}
				navigationService.navigateToDetailPage(url);
				return;
			}

			if (selectedLocation[0].groupId === 'property') {
				const selectedLocationDetails = selectedLocation[0].value as TPropertyLocationDetails;
				const url = await priceEstimatorService.handlePropertyChange(
					selectedLocationDetails,
					searchKeyword,
					appliedFilters
				);

				if (!url) {
					return;
				}

				// isFrom !== EModuleType.PROJECT &&
				// 	addPropertyToRecentSearch([selectedLocation[0].displayName], url, selectedLocationDetails[0], type);

				navigationService.navigateToDetailPage(url, screenName, props);

				return;
			}

			setIsListingSrLoading(true);
			setIsMapSrLoading(true);

			if (selectedLocation[0].groupId === 'street') {
				const selectedLocationDetails = selectedLocation[0].value as TStreetDetails;
				const { response, newFilters, url } = await listingSrService.handleStreetChangeWithArray(
					selectedLocation,
					restFilters,
					deviceType,
					searchKeyword,
					isFrom
				);

				// const { response, newFilters, url } = await locationChangeUseCase.execute({
				// 	appliedFilters,
				// 	deviceType,
				// 	selectedLocation,
				// 	searchKeyword,
				// 	isFrom
				// });

				// addLocationToRecentSearch(
				// 	[selectedLocation[0].displayName],
				// 	url,
				// 	appliedFilters,
				// 	[selectedLocationDetails],
				// 	type
				// );
				newResponse = response.data;
				setAppliedFilters(newFilters);
				setSrPageUrl(url);
			} else {
				const selectedLocationDetails = selectedLocation as TSelectedLocation[];
				// const locations = getLocationsDetails(selectedLocation as TSelectedSearch[], true);
				// const locationDetails = selectedLocationDetails.map((location) => location && location.value);
				const { response, newFilters, url } = await listingSrService.handleLocationChangeWithArray(
					selectedLocationDetails,
					restFilters,
					deviceType,
					searchKeyword,
					appliedFilters.pageType === ESchoolCatchmentSrPageType.project || isFrom === EModuleType.PROJECT
						? EModuleType.PROJECT
						: EModuleType.HOME
				);
				// const displayTexts = getSelectedLocationNameFromSrPageResponse(response.data);
				// addLocationToRecentSearch(displayTexts, url, appliedFilters, locationDetails, type);
				newResponse = response.data;
				setAppliedFilters(newFilters);
				setSrPageUrl(url);
			}

			const updatedResponse = handleRecentlyViewedUpdates(newResponse);
			setListingSrResponse(updatedResponse);
		} catch (error: any) {
			toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
		} finally {
			setIsListingSrLoading(false);
			setIsMapSrLoading(false);
		}
	};

	return { onLocationChange };
};
