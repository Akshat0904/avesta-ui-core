import { TGovPlaningAndZonesParams, TGovPlaningAndZonesResponse } from '@shared/types/types';

export interface IGovPlaningAndZones {
	getGovPlaningAndZones: (params: TGovPlaningAndZonesParams) => Promise<TGovPlaningAndZonesResponse>;
}
