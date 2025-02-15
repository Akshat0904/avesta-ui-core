import { AgentProfileCommand, AgentProfileResponse } from '@findAgent/types/agency.types';

export interface IAgentProfileRepository {
	getAgentProfile: (command: AgentProfileCommand) => Promise<AgentProfileResponse>;
}
