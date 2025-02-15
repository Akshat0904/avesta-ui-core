import { IAgentProfileRepository } from '@findAgent/infrastructure/interfaces/repositories/agentProfile.interface';
import { AgentProfileCommand, AgentProfileResponse } from '@findAgent/types/agency.types';
import { IConfigService } from '@shared/interfaces/configService';
import { IHttpService } from '@shared/interfaces/httpService';

export class AgentProfileRepositoryImpl implements IAgentProfileRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}

	async getAgentProfile(command: AgentProfileCommand): Promise<AgentProfileResponse> {
		try {
			const response = await this.httpClient.get<any>({
				path: this.config.getApiPaths().agentDetail,
				queryParams: command
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}
