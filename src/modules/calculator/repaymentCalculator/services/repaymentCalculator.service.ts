import { CalculatorRepository } from '../infrastructure/repositories/interfaces/repositories/calculator.interface';
import { CalculatePrincipalInterest, DefaultCalculatorValues } from '../types/types';

export class RepaymentCalculatorService {
	constructor(private calculatorRepository: CalculatorRepository) {}

	getDefaultCalculatorValues(): DefaultCalculatorValues {
		return this.calculatorRepository.getDefaultCalculatorValues();
	}

	calculatePrincipalInterest(command: CalculatePrincipalInterest) {
		const { interestRate, loanTerm, loanAmount } = command;

		const monthlyRate = this.calculateMonthlyRate(interestRate);
		const numberOfPayments = this.calculateNumberOfPayments(loanTerm);

		const monthlyRepayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
		return parseFloat(monthlyRepayment.toFixed(2));
	}

	calculateInterestOnly(loanAmount: number, interestRate: number) {
		const monthlyRate = this.calculateMonthlyRate(interestRate);
		return parseFloat((loanAmount * monthlyRate).toFixed(2));
	}

	private calculateMonthlyRate(interestRate: number): number {
		return interestRate / 100 / 12;
	}

	private calculateNumberOfPayments(loanTerm: number): number {
		return loanTerm * 12;
	}
}
