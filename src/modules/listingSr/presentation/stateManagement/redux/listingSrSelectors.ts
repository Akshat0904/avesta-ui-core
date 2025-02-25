import { useRootStateContext } from './rootStateContext';

const useRootStateSelectors = () => {
	const rootStateType = useRootStateContext();

	return {
		selectListingSrResponse: (state: typeof rootStateType) => state.listingSr.listingSrResponse,
		selectAppliedFilters: (state: typeof rootStateType) => state.listingSr.appliedFilters,
		selectIsListingSrLoading: (state: typeof rootStateType) => state.listingSr.isListingSrLoading,
		selectIsMapSrLoading: (state: typeof rootStateType) => state.listingSr.isMapSrLoading,
		selectSelectedLocationName: (state: typeof rootStateType) => state.listingSr.selectedLocationName,
		selectSrPageUrl: (state: typeof rootStateType) => state.listingSr.srPageUrl,
		selectIsCollapseBottomSheet: (state: typeof rootStateType) => state.listingSr.isCollapseBottomSheet,
		selectCompareProperties: (state: typeof rootStateType) => state.listingSr.compareProperties,
		selectSrMapInstance: (state: typeof rootStateType) => state.listingSr.srMapInstance,
		selectToggleSeeAll: (state: typeof rootStateType) => state.listingSr.toggleSeeAll,
		selectIsSortChange: (state: typeof rootStateType) => state.listingSr.isSortChange,
		selectDeviceType: (state: typeof rootStateType) => state.listingSr.deviceType,
		selectIsFrom: (state: typeof rootStateType) => state.listingSr.isFrom,
		selectIpAddress: (state: typeof rootStateType) => state.listingSr.ipAddress,
		selectPreviewSelection: (state: typeof rootStateType) => state.listingSr.previewSelection,
		selectListingDetailSelection: (state: typeof rootStateType) => state.listingSr.listingDetailSelection,
		selectPropertyDetailSelection: (state: typeof rootStateType) => state.listingSr.propertyDetailSelection,
		selectNewDevelopmentDetailSelection: (state: typeof rootStateType) =>
			state.listingSr.newDevelopmentDetailSelection,
		selectIsShowSchoolDisclaimer: (state: typeof rootStateType) => state.listingSr.isShowSchoolDisclaimer,
		selectSchoolInfo: (state: typeof rootStateType) => state.listingSr.schoolInfo
	};
};

export default useRootStateSelectors;
