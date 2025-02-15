import { INewDevHomeRepository } from '@newDevelopment/core/interface/newDevHomeRepository';
import { TInvestmentPropertyParams } from '@newDevelopment/core/types/newDevelopmentTypes';
import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';

export class NewDevHomeRepoImpl implements INewDevHomeRepository {
	constructor(private httpService: IHttpService, private configService: IConfigService) {}

	async getInvestmentProperty(params: TInvestmentPropertyParams) {
		try {
			return this.httpService.get<any>({
				path: this.configService.getApiPaths().newDevHomePage,
				queryParams: params
			});
		} catch (error) {
			throw error;
		}
	}
}
