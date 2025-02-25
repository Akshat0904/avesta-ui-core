import React, { useState, useContext, ReactNode } from 'react';
import {
	TListingSrPageResponse,
	TListingSrHookInitialData,
	ISchoolInfoEsRes
} from '@listingSr/core/types/listingSrTypes';
import { ESaleMethod, IListingSrData } from '@realestateview/avesta-js-core';
import { TCompareProperty } from '@shared/types/types';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import { IListingSrState } from '@listingSr/core/types/listingSrState';

interface ListingSrProviderProps {
	children: ReactNode;
	initialData?: Partial<TListingSrHookInitialData>;
}

const ListingSrContext = React.createContext<IListingSrState | undefined>(undefined);

export const ListingSrProvider: React.FC<ListingSrProviderProps> = ({ children, initialData = {} }) => {
	const [listingSrResponse, setListingSrResponse] = useState<TListingSrPageResponse>(
		initialData.listingSrResponse || {
			listings: [],
			p360Properties: { total: 0, data: [] },
			pins: [],
			seoDescription: '',
			pinsTotal: 0,
			filterTotal: 0,
			size: 0
		}
	);

	const [appliedFilters, setAppliedFilters] = useState<IListingSrData>(
		initialData.appliedFilters || { saleMethod: [ESaleMethod.sale] }
	);

	const [isListingSrLoading, setIsListingSrLoading] = useState(initialData.isListingSrLoading || false);
	const [isMapSrLoading, setIsMapSrLoading] = useState(initialData.isMapSrLoading || false);
	const [selectedLocationName, setSelectedLocationName] = useState(initialData.selectedLocationName || []);
	const [srPageUrl, setSrPageUrl] = useState(initialData.srPageUrl || '');
	const [isCollapseBottomSheet, setIsCollapseBottomSheet] = useState(initialData.isCollapseBottomSheet || false);
	const [compareProperties, setCompareProperties] = useState<TCompareProperty[]>(initialData.compareProperties || []);
	const [srMapInstance, setSrMapInstance] = useState<any>(initialData.srMapInstance || null);
	const [toggleSeeAll, setToggleSeeAll] = useState(initialData.toggleSeeAll || false);
	const [isSortChange, setIsSortChange] = useState(initialData.isSortChange || false);
	const [deviceType, setDeviceType] = useState<EAccessDeviceType>(
		initialData.deviceType || EAccessDeviceType.MobileWeb
	);
	const [isShowSchoolDisclaimer, setIsShowSchoolDisclaimer] = useState<boolean>(false);

	const ipAddress = initialData.ipAddress || '';

	const [isFrom, setIsFrom] = useState<EModuleType>(initialData.isFrom || EModuleType.HOME);
	// PropertyPreview states
	const [previewSelection, setPreviewSelection] = useState(initialData.previewSelection || []);
	const [listingDetailSelection, setListingDetailSelection] = useState(initialData.listingDetailSelection || null);
	const [propertyDetailSelection, setPropertyDetailSelection] = useState(initialData.propertyDetailSelection || null);
	const [newDevelopmentDetailSelection, setNewDevelopmentDetailSelection] = useState(
		initialData.newDevelopmentDetailSelection || null
	);
	const [schoolInfo, setSchoolInfo] = useState<ISchoolInfoEsRes[]>([]);

	const useListingSrResponse = () => listingSrResponse;
	const useSetListingSrResponse = () => setListingSrResponse;

	const useAppliedFilters = () => appliedFilters;
	const useSetAppliedFilters = () => setAppliedFilters;

	const useIsListingSrLoading = () => isListingSrLoading;
	const useSetIsListingSrLoading = () => setIsListingSrLoading;

	const useIsMapSrLoading = () => isMapSrLoading;
	const useSetIsMapSrLoading = () => setIsMapSrLoading;

	const useSelectedLocationName = () => selectedLocationName;
	const useSetSelectedLocationName = () => setSelectedLocationName;

	const useSrPageUrl = () => srPageUrl;
	const useSetSrPageUrl = () => setSrPageUrl;

	const useIsCollapseBottomSheet = () => isCollapseBottomSheet;
	const useSetIsCollapseBottomSheet = () => setIsCollapseBottomSheet;

	const useCompareProperties = () => compareProperties;
	const useSetCompareProperties = () => setCompareProperties;

	const useSrMapInstance = () => srMapInstance;
	const useSetSrMapInstance = () => setSrMapInstance;

	const useToggleSeeAll = () => toggleSeeAll;
	const useSetToggleSeeAll = () => setToggleSeeAll;

	const useIsSortChange = () => isSortChange;
	const useSetIsSortChange = () => setIsSortChange;

	const useDeviceType = () => deviceType;
	const useSetDeviceType = () => setDeviceType;

	const useIsFrom = () => isFrom;
	const useSetIsFrom = () => setIsFrom;

	const useIpAddress = () => ipAddress;

	const usePreviewSelection = () => previewSelection;
	const useSetPreviewSelection = () => setPreviewSelection;

	const useListingDetailSelection = () => listingDetailSelection;
	const useSetListingDetailSelection = () => setListingDetailSelection;

	const usePropertyDetailSelection = () => propertyDetailSelection;
	const useSetPropertyDetailSelection = () => setPropertyDetailSelection;

	const useNewDevelopmentDetailSelection = () => newDevelopmentDetailSelection;
	const useSetNewDevelopmentDetailSelection = () => setNewDevelopmentDetailSelection;

	const useIsShowSchoolDisclaimer = () => isShowSchoolDisclaimer;
	const useSetIsShowSchoolDisclaimer = () => setIsShowSchoolDisclaimer;

	const useSchoolInfo = () => schoolInfo;
	const useSetSchoolInfo = () => setSchoolInfo;

	return (
		<ListingSrContext.Provider
			value={{
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
				useSetDeviceType,
				useIsFrom,
				useSetIsFrom,
				useIpAddress,
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
				useSetSchoolInfo
			}}
		>
			{children}
		</ListingSrContext.Provider>
	);
};

export const useListingSrContext = (): IListingSrState => {
	const context = useContext(ListingSrContext);

	if (!context) {
		throw new Error('useListingSrContext must be used within a ListingSrProvider');
	}

	return context;
};
