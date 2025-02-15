// avesta-ui-core/src/modules/calculator/repaymentCalculator/strategies/principalInte
import { RepaymentCalculatorService } from '@calculator/repaymentCalculator/services/repaymentCalculator.service';
import { CalculateRepaymentCommand } from '@calculator/repaymentCalculator/commands/calculator.command';
import { CalCulatorInteractions } from './calculatorInteractions.interface';

export class PrincipalInterestStrategy implements CalCulatorInteractions {
	constructor(private repaymentCalculatorService: RepaymentCalculatorService) {}

	calculate(command: CalculateRepaymentCommand): number {
		return this.repaymentCalculatorService.calculatePrincipalInterest(command);
	}
}
