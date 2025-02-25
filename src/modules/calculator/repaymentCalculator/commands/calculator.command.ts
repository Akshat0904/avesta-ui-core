import { ERepaymentType } from '../types/enums';

export type CalculateRepaymentCommand = {
	propertyPrice: number;
	loanAmount: number;
	savings: number;
	interestRate: number;
	loanTerm: number;
	repaymentType: ERepaymentType;
};

export type DefaultCalculatorHookCommand = {
	propertyPrice: number;
	savings: number;
	loanAmount: number;
	interestRate: string;
	loanTerm: string;
	repaymentType: ERepaymentType;
};

export type DefaultCalculatorInitialValuesCommand = DefaultCalculatorHookCommand & {
	minPropertyPrice: number;
	maxPropertyPrice: number;
	minInterestRate: number;
	maxInterestRate: number;
	interestOnlyRate: string;
};

export type CalculateRepaymentFirstInteractionCommand = CalculateRepaymentCommand & {
	firstUserInteraction: boolean;
};
