import { CalculateRepaymentCommand } from '../../commands/calculator.command';
import { RepaymentCalculatorService } from '@calculator/repaymentCalculator/services/repaymentCalculator.service';
import { ERepaymentType } from '@calculator/repaymentCalculator/types/enums';
import { CalCulatorInteractions } from './strategies/calculatorInteractions.interface';
import { ICalculatorAnalyticsService } from '../../infrastructure/repositories/interfaces/services/calculatorAnalyticsService.interface';
import { PrincipalInterestStrategy } from './strategies/principalInterest.strategy';
import { InterestOnlyStrategy } from './strategies/interestOnly.strategy';
import { CalculatorUseCaseCommand } from '@calculator/repaymentCalculator/types/types';

export class CalculatorInteractionsUseCase {
	private strategy: CalCulatorInteractions;

	constructor(
		private repaymentCalculatorService: RepaymentCalculatorService,
		private calculatorAnalyticsService: ICalculatorAnalyticsService
	) {}

	execute(interactionsCommand: CalculatorUseCaseCommand) {
		const { command, firstUserInteraction, matomoDetails } = interactionsCommand;
		const { propertyPrice, loanAmount, interestRate, repaymentType } = command;

		if (propertyPrice <= 0 || loanAmount === 0 || interestRate <= 0) {
			return 0;
		}

		if (firstUserInteraction && matomoDetails) {
			this.calculatorAnalyticsService.trackCalculatorUsage(matomoDetails);
		}

		this.strategy = this.getStrategy(repaymentType);
		return this.strategy.calculate(command);
	}

	private getStrategy(repaymentType: ERepaymentType): CalCulatorInteractions {
		switch (repaymentType) {
			case ERepaymentType.INTEREST_ONLY:
				return new InterestOnlyStrategy(this.repaymentCalculatorService);
			default:
				return new PrincipalInterestStrategy(this.repaymentCalculatorService);
		}
	}
}
