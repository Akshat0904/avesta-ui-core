import {
	ISchoolInfoEsRes,
	TListingSrPageResponse,
	TListingSrPropertyPreviewContext
} from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { TCompareProperty } from '@shared/types/types';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';

export interface IListingSrState {
	useListingSrResponse: () => TListingSrPageResponse;
	useSetListingSrResponse: () => (response: TListingSrPageResponse) => void;

	useAppliedFilters: () => IListingSrData & ISchoolCatchmentSrUrlFromData;
	useSetAppliedFilters: () => (filters: IListingSrData & ISchoolCatchmentSrUrlFromData) => void;

	useIsListingSrLoading: () => boolean;
	useSetIsListingSrLoading: () => (isLoading: boolean) => void;

	useIsMapSrLoading: () => boolean;
	useSetIsMapSrLoading: () => (isLoading: boolean) => void;

	useSelectedLocationName: () => string[];
	useSetSelectedLocationName: () => (name: string[]) => void;

	useSrPageUrl: () => string;
	useSetSrPageUrl: () => (url: string) => void;

	useIsCollapseBottomSheet: () => boolean;
	useSetIsCollapseBottomSheet: () => (isCollapsed: boolean) => void;

	useCompareProperties: () => TCompareProperty[];
	useSetCompareProperties: () => (properties: TCompareProperty[]) => void;

	useSrMapInstance: () => any;
	useSetSrMapInstance: () => (instance: any) => void;

	useToggleSeeAll: () => boolean;
	useSetToggleSeeAll: () => (toggle: boolean) => void;

	useIsSortChange: () => boolean;
	useSetIsSortChange: () => (isSortChange: boolean) => void;

	useDeviceType: () => EAccessDeviceType;
	useSetDeviceType: () => (deviceType: EAccessDeviceType) => void;

	useIsFrom: () => EModuleType;
	useSetIsFrom: () => (isFrom: EModuleType) => void;

	useIpAddress: () => string;

	//Property Preview
	usePreviewSelection: () => TListingSrPropertyPreviewContext['previewSelection'];
	useSetPreviewSelection: () => (selection: TListingSrPropertyPreviewContext['previewSelection']) => void;

	useListingDetailSelection: () => TListingSrPropertyPreviewContext['listingDetailSelection'];
	useSetListingDetailSelection: () => (selection: TListingSrPropertyPreviewContext['listingDetailSelection']) => void;

	usePropertyDetailSelection: () => TListingSrPropertyPreviewContext['propertyDetailSelection'];
	useSetPropertyDetailSelection: () => (
		selection: TListingSrPropertyPreviewContext['propertyDetailSelection']
	) => void;

	useNewDevelopmentDetailSelection: () => TListingSrPropertyPreviewContext['newDevelopmentDetailSelection'];
	useSetNewDevelopmentDetailSelection: () => (
		selection: TListingSrPropertyPreviewContext['newDevelopmentDetailSelection']
	) => void;

	useIsShowSchoolDisclaimer: () => boolean;
	useSetIsShowSchoolDisclaimer: () => (isShow: boolean) => void;

	useSchoolInfo: () => ISchoolInfoEsRes[];
	useSetSchoolInfo: () => (schoolInfo: ISchoolInfoEsRes[]) => void;
}
