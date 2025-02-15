import { IGovPlaningAndZones } from '@shared/interfaces/governmentPlaningAndZonesRepository';
import { TGovPlaningAndZonesParams } from '@shared/types/types';

export class GovernmentPlaningAndZoneService {
	constructor(private repo: IGovPlaningAndZones) {}

	getGovPlaningAndZones(params: TGovPlaningAndZonesParams) {
		return this.repo.getGovPlaningAndZones(params);
	}
}
