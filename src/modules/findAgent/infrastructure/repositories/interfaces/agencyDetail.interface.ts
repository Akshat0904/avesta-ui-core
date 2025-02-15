import { AgencyProfileResponse, AgencyRequestCommand } from '@findAgent/types/agency.types';

export interface IAgencyDetailRepository {
	getAgencyDetails: (command: AgencyRequestCommand) => Promise<AgencyProfileResponse>;
}
