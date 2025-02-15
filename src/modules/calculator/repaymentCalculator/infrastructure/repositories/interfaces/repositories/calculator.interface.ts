import { DefaultCalculatorValues } from '@calculator/repaymentCalculator/types/types';

export interface CalculatorRepository {
	getDefaultCalculatorValues: () => DefaultCalculatorValues;
}
