import { useEffect, useRef } from 'react';
import { useListingSrFilters } from '@listingSr/presentation/hooks/useListingSrFilters';
import { useListingsByGridIds } from '@listingSr/presentation/hooks/useListingsByGridIds';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { EAccessDeviceType, EModuleType } from '../types/enums';
import { deviceTypeLatLong } from '../constants/constants';
import { useServices } from './useServices';

export const useListingSrMap = () => {
	const { onFilterChange } = useListingSrFilters();
	const aValueRef = useRef(false);

	const stateManager: IListingSrState = getStateManager();

	const setListingSrResponse = stateManager.useSetListingSrResponse();
	const setToggleSeeAll = stateManager.useSetToggleSeeAll();
	const setAppliedFilters = stateManager.useSetAppliedFilters();
	const listingSrResponse = stateManager.useListingSrResponse();
	const appliedFilters = stateManager.useAppliedFilters();
	const srMapInstance = stateManager.useSrMapInstance();
	const toggleSeeAll = stateManager.useToggleSeeAll();
	const deviceType = stateManager.useDeviceType();

	const { retrieveListingsByGridIds } = useListingsByGridIds();
	const { srAnalyticsService } = useServices();
	const isFrom = stateManager.useIsFrom();
	const onToggleSeeAllButton = (aValue: boolean) => {
		aValueRef.current = aValue;
		setToggleSeeAll(true);
		srAnalyticsService.trackSeeAllButtonInteraction(
			appliedFilters,
			listingSrResponse.locationESRecords,
			listingSrResponse.streetESRecords
		);

		if (srMapInstance) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}

		const newAppliedFilters = {
			...appliedFilters,
			page: 1,
			includeP360Properties: aValue
		};
		setAppliedFilters(newAppliedFilters);

		if (!aValue) {
			return setListingSrResponse({
				...listingSrResponse,
				p360Properties: {
					total: 0,
					data: []
				}
			});
		}
	};

	useEffect(() => {
		if (toggleSeeAll !== false && aValueRef.current) {
			const type = isFrom === EModuleType.PROJECT ? EModuleType.PROJECT : EModuleType.HOME;
			onFilterChange(
				{
					...appliedFilters,
					includeP360Properties: aValueRef.current
				},
				type
			);

			setToggleSeeAll(false);
		}
	}, [toggleSeeAll, appliedFilters]);

	const getMapCenter = () => {
		if (deviceType === EAccessDeviceType.Desktop) {
			return deviceTypeLatLong.desktop;
		}

		return deviceTypeLatLong.mobile;
	};

	const getListingsByGridIds = (zoom: number) => {
		if (!srMapInstance) {
			return;
		}

		if (deviceType === EAccessDeviceType.Desktop) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}
		const UpdatedAppliedFilters = {
			...appliedFilters,
			zoom: zoom
		};
		retrieveListingsByGridIds(UpdatedAppliedFilters);
	};

	return { onToggleSeeAllButton, getMapCenter, getListingsByGridIds };
};
