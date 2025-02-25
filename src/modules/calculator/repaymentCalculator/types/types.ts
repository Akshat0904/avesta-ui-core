import { CalculateRepaymentCommand } from '../commands/calculator.command';
import { ERepaymentType } from './enums';

export type DefaultCalculatorValues = {
	interestRate: string;
	loanTerm: string;
	repaymentType: ERepaymentType;
	deposit: number;
	interestOnlyRate: string;
	minPropertyPrice: number;
	maxPropertyPrice: number;
	minInterestRate: number;
	maxInterestRate: number;
};

export type CalculatePrincipalInterest = {
	interestRate: number;
	loanTerm: number;
	loanAmount: number;
};

export type CalculatorUseCaseCommand = {
	command: CalculateRepaymentCommand;
	firstUserInteraction: boolean;
	matomoDetails?: any;
};
