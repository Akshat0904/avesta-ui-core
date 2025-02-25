import { IAgentProfileRepository } from '@findAgent/infrastructure/interfaces/repositories/agentProfile.interface';
import { AgentProfileCommand, AgentProfileResponse } from '@findAgent/types/agency.types';

export class AgentProfileUseCase {
	constructor(private agentProfileRepo: IAgentProfileRepository) {}

	async execute(command: AgentProfileCommand): Promise<AgentProfileResponse> {
		try {
			return await this.agentProfileRepo.getAgentProfile(command);
		} catch (error) {
			throw error;
		}
	}
}
