import { IHttpService } from '@shared/interfaces/httpService';
import { IGovPlaningAndZones } from '@shared/interfaces/governmentPlaningAndZonesRepository';
import { IConfigService } from '@shared/interfaces/configService';
import { TGovPlaningAndZonesParams, TGovPlaningAndZonesResponse } from '@shared/types/types';

export class GovernmentPlaningAndZoneRepositoryImpl implements IGovPlaningAndZones {
	constructor(private httpClient: IHttpService, private configService: IConfigService) {}
	async getGovPlaningAndZones(params: TGovPlaningAndZonesParams): Promise<TGovPlaningAndZonesResponse> {
		try {
			return this.httpClient.get<any>({
				path: this.configService.getApiPaths().govPlaningAndZones,
				queryParams: params
			});
		} catch (error) {
			throw error;
		}
	}
}
