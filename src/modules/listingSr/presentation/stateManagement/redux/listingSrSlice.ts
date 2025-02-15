import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ESaleMethod, IListingSrData } from '@realestateview/avesta-js-core';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import { TCompareProperty } from '@shared/types/types';
import { ISchoolInfoEsRes, TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';

export interface ListingSrState {
	listingSrResponse: TListingSrPageResponse;
	appliedFilters: IListingSrData;
	isListingSrLoading: boolean;
	isMapSrLoading: boolean;
	selectedLocationName: string[];
	srPageUrl: string;
	isCollapseBottomSheet: boolean;
	compareProperties: TCompareProperty[];
	srMapInstance: any;
	toggleSeeAll: boolean;
	isSortChange: boolean;
	deviceType: EAccessDeviceType;
	isFrom?: EModuleType;
	isShowSchoolDisclaimer: boolean;
	previewSelection: any;
	listingDetailSelection: any;
	propertyDetailSelection: any;
	newDevelopmentDetailSelection: any;
	schoolInfo: ISchoolInfoEsRes[];
}

const initialState: ListingSrState = {
	listingSrResponse: {
		listings: [],
		p360Properties: { total: 0, data: [] },
		pins: [],
		seoDescription: '',
		pinsTotal: 0,
		filterTotal: 0,
		size: 0
	},
	appliedFilters: { saleMethod: [ESaleMethod.sale] },
	isListingSrLoading: false,
	isMapSrLoading: false,
	selectedLocationName: [],
	srPageUrl: '',
	isCollapseBottomSheet: false,
	compareProperties: [],
	srMapInstance: null,
	toggleSeeAll: false,
	isSortChange: false,
	deviceType: EAccessDeviceType.MobileWeb,
	isFrom: EModuleType.HOME,
	// PropertyPreview states
	previewSelection: [],
	listingDetailSelection: null,
	propertyDetailSelection: null,
	isShowSchoolDisclaimer: false,
	newDevelopmentDetailSelection: null,
	schoolInfo: []
};

const listingSrSlice = createSlice({
	name: 'listingSr',
	initialState,
	reducers: {
		setListingSrResponse(state, action: PayloadAction<TListingSrPageResponse>) {
			state.listingSrResponse = action.payload;
		},
		setAppliedFilters(state, action: PayloadAction<IListingSrData>) {
			state.appliedFilters = action.payload;
		},
		setIsListingSrLoading(state, action: PayloadAction<boolean>) {
			state.isListingSrLoading = action.payload;
		},
		setIsMapSrLoading(state, action: PayloadAction<boolean>) {
			state.isMapSrLoading = action.payload;
		},
		setSelectedLocationName(state, action: PayloadAction<string[]>) {
			state.selectedLocationName = action.payload;
		},
		setSrPageUrl(state, action: PayloadAction<string>) {
			state.srPageUrl = action.payload;
		},
		setIsCollapseBottomSheet(state, action: PayloadAction<boolean>) {
			state.isCollapseBottomSheet = action.payload;
		},
		setCompareProperties(state, action: PayloadAction<TCompareProperty[]>) {
			state.compareProperties = action.payload;
		},
		setSrMapInstance(state, action: PayloadAction<any>) {
			state.srMapInstance = action.payload;
		},
		setToggleSeeAll(state, action: PayloadAction<boolean>) {
			state.toggleSeeAll = action.payload;
		},
		setIsSortChange(state, action: PayloadAction<boolean>) {
			state.isSortChange = action.payload;
		},
		setDeviceType(state, action: PayloadAction<EAccessDeviceType>) {
			state.deviceType = action.payload;
		},
		setPreviewSelection(state, action: PayloadAction<any>) {
			state.previewSelection = action.payload;
		},
		setListingDetailSelection(state, action: PayloadAction<any>) {
			state.listingDetailSelection = action.payload;
		},
		setPropertyDetailSelection(state, action: PayloadAction<any>) {
			state.propertyDetailSelection = action.payload;
		},
		setNewDevelopmentDetailSelection(state, action: PayloadAction<any>) {
			state.newDevelopmentDetailSelection = action.payload;
		},
		setIsShowSchoolDisclaimer(state, action: PayloadAction<any>) {
			state.isShowSchoolDisclaimer = action.payload;
		},
		setSchoolInfo(state, action: PayloadAction<ISchoolInfoEsRes[]>) {
			state.schoolInfo = action.payload;
		},
		setIsFrom(state, action: PayloadAction<EModuleType>) {
			state.isFrom = action.payload;
		}
	}
});

export const {
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
} = listingSrSlice.actions;

export default listingSrSlice.reducer;
