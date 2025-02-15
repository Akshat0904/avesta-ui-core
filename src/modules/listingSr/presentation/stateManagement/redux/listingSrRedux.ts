import { useDispatch, useSelector } from 'react-redux';
import { ISchoolInfoEsRes, TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData } from '@realestateview/avesta-js-core';
import { TCompareProperty } from '@shared/types/types';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import { IListingSrState } from '../../../core/types/listingSrState';
import {
	setListingSrResponse,
	setAppliedFilters,
	setIsListingSrLoading,
	setIsMapSrLoading,
	setSelectedLocationName,
	setSrPageUrl,
	setIsCollapseBottomSheet,
	setCompareProperties,
	setSrMapInstance,
	setToggleSeeAll,
	setIsSortChange,
	setDeviceType,
	setPreviewSelection,
	setListingDetailSelection,
	setPropertyDetailSelection,
	setNewDevelopmentDetailSelection,
	setIsShowSchoolDisclaimer,
	setSchoolInfo,
	setIsFrom
} from './listingSrSlice';
import useRootStateSelectors from './listingSrSelectors';
import { useRootStateContext } from './rootStateContext';

export const useListingSrRedux = (): IListingSrState => {
	const rootStateType = useRootStateContext();
	const {
		selectAppliedFilters,
		selectCompareProperties,
		selectDeviceType,
		selectIsCollapseBottomSheet,
		selectIsListingSrLoading,
		selectIsMapSrLoading,
		selectIsSortChange,
		selectListingSrResponse,
		selectSelectedLocationName,
		selectSrMapInstance,
		selectSrPageUrl,
		selectToggleSeeAll,
		selectPreviewSelection,
		selectIsFrom,
		selectListingDetailSelection,
		selectPropertyDetailSelection,
		selectIpAddress,
		selectNewDevelopmentDetailSelection,
		selectIsShowSchoolDisclaimer,
		selectSchoolInfo
	} = useRootStateSelectors();

	const dispatch = useDispatch();

	const useListingSrResponse = () => useSelector((state: typeof rootStateType) => selectListingSrResponse(state));
	const useSetListingSrResponse = () => (response: TListingSrPageResponse) =>
		dispatch(setListingSrResponse(response));

	const useAppliedFilters = () => useSelector((state: typeof rootStateType) => selectAppliedFilters(state));
	const useSetAppliedFilters = () => (filters: IListingSrData) => dispatch(setAppliedFilters(filters));

	const useIsListingSrLoading = () => useSelector((state: typeof rootStateType) => selectIsListingSrLoading(state));
	const useSetIsListingSrLoading = () => (isLoading: boolean) => dispatch(setIsListingSrLoading(isLoading));

	const useIsMapSrLoading = () => useSelector((state: typeof rootStateType) => selectIsMapSrLoading(state));
	const useSetIsMapSrLoading = () => (isLoading: boolean) => dispatch(setIsMapSrLoading(isLoading));

	const useSelectedLocationName = () =>
		useSelector((state: typeof rootStateType) => selectSelectedLocationName(state));
	const useSetSelectedLocationName = () => (name: string[]) => dispatch(setSelectedLocationName(name));

	const useSrPageUrl = () => useSelector((state: typeof rootStateType) => selectSrPageUrl(state));
	const useSetSrPageUrl = () => (url: string) => dispatch(setSrPageUrl(url));

	const useIsCollapseBottomSheet = () =>
		useSelector((state: typeof rootStateType) => selectIsCollapseBottomSheet(state));
	const useSetIsCollapseBottomSheet = () => (isCollapsed: boolean) => dispatch(setIsCollapseBottomSheet(isCollapsed));

	const useCompareProperties = () => useSelector((state: typeof rootStateType) => selectCompareProperties(state));
	const useSetCompareProperties = () => (properties: TCompareProperty[]) =>
		dispatch(setCompareProperties(properties));

	const useSrMapInstance = () => useSelector((state: typeof rootStateType) => selectSrMapInstance(state));
	const useSetSrMapInstance = () => (instance: any) => dispatch(setSrMapInstance(instance));

	const useToggleSeeAll = () => useSelector((state: typeof rootStateType) => selectToggleSeeAll(state));
	const useSetToggleSeeAll = () => (toggle: boolean) => dispatch(setToggleSeeAll(toggle));

	const useIsSortChange = () => useSelector((state: typeof rootStateType) => selectIsSortChange(state));
	const useSetIsSortChange = () => (isSortChange: boolean) => dispatch(setIsSortChange(isSortChange));

	const useDeviceType = () => useSelector((state: typeof rootStateType) => selectDeviceType(state));
	const useSetDeviceType = () => (deviceType: EAccessDeviceType) => dispatch(setDeviceType(deviceType));

	const useIsFrom = () => useSelector((state: typeof rootStateType) => selectIsFrom(state));
	const useSetIsFrom = () => (isFrom: EModuleType) => dispatch(setIsFrom(isFrom));

	const useIpAddress = () => useSelector((state: typeof rootStateType) => selectIpAddress(state));

	const usePreviewSelection = () => useSelector((state: typeof rootStateType) => selectPreviewSelection(state));
	const useSetPreviewSelection = () => (previewSelection: any) => dispatch(setPreviewSelection(previewSelection));

	const useListingDetailSelection = () =>
		useSelector((state: typeof rootStateType) => selectListingDetailSelection(state));
	const useSetListingDetailSelection = () => (listingDetailSelection: any) =>
		dispatch(setListingDetailSelection(listingDetailSelection));

	const usePropertyDetailSelection = () =>
		useSelector((state: typeof rootStateType) => selectPropertyDetailSelection(state));
	const useSetPropertyDetailSelection = () => (propertyDetailSelection: any) =>
		dispatch(setPropertyDetailSelection(propertyDetailSelection));

	const useNewDevelopmentDetailSelection = () =>
		useSelector((state: typeof rootStateType) => selectNewDevelopmentDetailSelection(state));
	const useSetNewDevelopmentDetailSelection = () => (newDevelopmentDetailSelection: any) =>
		dispatch(setNewDevelopmentDetailSelection(newDevelopmentDetailSelection));

	const useIsShowSchoolDisclaimer = () =>
		useSelector((state: typeof rootStateType) => selectIsShowSchoolDisclaimer(state));
	const useSetIsShowSchoolDisclaimer = () => (isShow: boolean) => dispatch(setIsShowSchoolDisclaimer(isShow));

	const useSchoolInfo = () => useSelector((state: typeof rootStateType) => selectSchoolInfo(state));
	const useSetSchoolInfo = () => (schoolInfo: ISchoolInfoEsRes[]) => dispatch(setSchoolInfo(schoolInfo));

	return {
		useListingSrResponse,
		useSetListingSrResponse,
		useAppliedFilters,
		useSetAppliedFilters,
		useIsListingSrLoading,
		useSetIsListingSrLoading,
		useIsMapSrLoading,
		useSetIsMapSrLoading,
		useSelectedLocationName,
		useSetSelectedLocationName,
		useSrPageUrl,
		useSetSrPageUrl,
		useIsCollapseBottomSheet,
		useSetIsCollapseBottomSheet,
		useCompareProperties,
		useSetCompareProperties,
		useSrMapInstance,
		useSetSrMapInstance,
		useToggleSeeAll,
		useSetToggleSeeAll,
		useIsSortChange,
		useSetIsSortChange,
		useDeviceType,
		useIsFrom,
		useIpAddress,
		useSetDeviceType,
		usePreviewSelection,
		useSetPreviewSelection,
		useListingDetailSelection,
		useSetListingDetailSelection,
		usePropertyDetailSelection,
		useSetPropertyDetailSelection,
		useNewDevelopmentDetailSelection,
		useSetNewDevelopmentDetailSelection,
		useIsShowSchoolDisclaimer,
		useSetIsShowSchoolDisclaimer,
		useSchoolInfo,
		useSetSchoolInfo,
		useSetIsFrom
	};
};
