import { useState } from 'react';
import { useSharedService } from './useSharedService';
import { TGovPlaningAndZonesParams } from '@shared/types/types';

export const useGovernmentPlaningAndZoneApiRequest = () => {
	const { toasterService, authorizedService, GovernmentPlaningAndZoneService } = useSharedService();
	const [loading, setLoading] = useState<boolean>(false);

	const getGovPlaningAndZonesData = async (params: TGovPlaningAndZonesParams) => {
		setLoading(true);
		try {
			return await GovernmentPlaningAndZoneService.getGovPlaningAndZones(params);
		} catch (error: any) {
			setLoading(false);
			if (error.statusCode === 401) {
				authorizedService.handle401Error(error.message);
			} else {
				toasterService.customToaster(error.message, 'error');
			}
		} finally {
			setLoading(false);
		}
	};

	return { getGovPlaningAndZonesData, loading };
};
