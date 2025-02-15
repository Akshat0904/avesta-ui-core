import { CalculateRepaymentCommand } from '@calculator/repaymentCalculator/commands/calculator.command';

// avesta-ui-core/src/modules/calculator/repaymentCalculator/strategies/repaymentStrategy.ts
export interface CalCulatorInteractions {
	calculate(command: CalculateRepaymentCommand): number;
}
