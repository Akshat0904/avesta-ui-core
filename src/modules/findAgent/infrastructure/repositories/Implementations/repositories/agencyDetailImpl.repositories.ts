import { IHttpService } from '@shared/interfaces/httpService';
import { IConfigService } from '@shared/interfaces/configService';
import { IAgencyDetailRepository } from '@findAgent/infrastructure/repositories/interfaces/agencyDetail.interface';
import { AgencyProfileResponse, AgencyRequestCommand } from '@findAgent/types/agency.types';

export class AgencyDetailRepositoryImpl implements IAgencyDetailRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}

	async getAgencyDetails(command: AgencyRequestCommand): Promise<AgencyProfileResponse> {
		try {
			const response = await this.httpClient.get<any>({
				path: this.config.getApiPaths().agencyDetail,
				queryParams: command
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}
