import { IConfigService } from '@shared/interfaces/configService';
import { DefaultCalculatorValues } from '@calculator/repaymentCalculator/types/types';
import { CalculatorRepository } from '../../interfaces/repositories/calculator.interface';

export class CalculatorRepositoryImpl implements CalculatorRepository {
	constructor(private configService: IConfigService) {}

	getDefaultCalculatorValues(): DefaultCalculatorValues {
		return this.configService.getAppConfig().repaymentCalculator;
	}
}
