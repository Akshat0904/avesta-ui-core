import { IAgencyDetailRepository } from '@findAgent/infrastructure/repositories/interfaces/agencyDetail.interface';
import { AgencyProfileResponse, AgencyRequestCommand } from '@findAgent/types/agency.types';

export class AgencyDetailUseCase {
	constructor(private agencyDetailRepository: IAgencyDetailRepository) {}

	async execute(agencyCommand: AgencyRequestCommand): Promise<AgencyProfileResponse> {
		try {
			return await this.agencyDetailRepository.getAgencyDetails(agencyCommand);
		} catch (error) {
			throw error;
		}
	}
}
