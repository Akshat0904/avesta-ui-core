import { DefaultCalculatorHookCommand } from '../commands/calculator.command';

export class RepaymentCalculatorMapper {
	static toCalculateRepaymentCommand(values: DefaultCalculatorHookCommand) {
		return {
			...values,
			interestRate: Number(values.interestRate.replace('%', '')),
			loanTerm: Number(values.loanTerm.split(' ')[0])
		};
	}
}
