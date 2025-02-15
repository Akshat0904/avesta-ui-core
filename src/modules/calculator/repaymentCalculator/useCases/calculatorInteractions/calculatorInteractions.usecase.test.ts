import { CalculatorInteractionsUseCase } from './calculatorInteractions.usecase';
import { RepaymentCalculatorService } from '@calculator/repaymentCalculator/services/repaymentCalculator.service';
import { ERepaymentType } from '@calculator/repaymentCalculator/types/enums';
import { ICalculatorAnalyticsService } from '@calculator/repaymentCalculator/infrastructure/repositories/interfaces/services/calculatorAnalyticsService.interface';
import { CalculateRepaymentCommand } from '@calculator/repaymentCalculator/commands/calculator.command';
import { CalculatorRepository } from '@calculator/repaymentCalculator/infrastructure/repositories/interfaces/repositories/calculator.interface';

const mockDataForPrincipalInterest = [
	{
		command: {
			propertyPrice: 100000,
			loanAmount: 80000,
			interestRate: 5,
			repaymentType: ERepaymentType.PRINCIPAL_INTEREST,
			savings: 0,
			loanTerm: 30
		},
		expected: 429.46
	},
	{
		command: {
			propertyPrice: 2000000,
			loanAmount: 2000000,
			interestRate: 6.2,
			repaymentType: ERepaymentType.PRINCIPAL_INTEREST,
			savings: 0,
			loanTerm: 30
		},
		expected: 12249.38
	}
];

const mockDataForInterestOnly = [
	{
		command: {
			propertyPrice: 100000,
			loanAmount: 80000,
			interestRate: 5,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 30
		},
		expected: 333.33
	},
	{
		command: {
			propertyPrice: 2000000,
			loanAmount: 2000000,
			interestRate: 6.2,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 30
		},
		expected: 10333.33
	}
];

describe('RepaymentCalculatorUseCase', () => {
	let repaymentCalculatorService: RepaymentCalculatorService;
	let repaymentCalculatorUseCase: CalculatorInteractionsUseCase;
	let mockRepository: jest.Mocked<CalculatorRepository>;
	let mockAnalyticsService: jest.Mocked<ICalculatorAnalyticsService>;
	let useCase: CalculatorInteractionsUseCase;
	beforeEach(() => {
		mockRepository = {
			getDefaultCalculatorValues: jest.fn()
		};
		mockAnalyticsService = {
			trackCalculatorUsage: jest.fn()
		};
		repaymentCalculatorService = new RepaymentCalculatorService(mockRepository);
		repaymentCalculatorUseCase = new CalculatorInteractionsUseCase(
			repaymentCalculatorService,
			mockAnalyticsService
		);
		useCase = new CalculatorInteractionsUseCase(repaymentCalculatorService, mockAnalyticsService);
	});

	it('should return 0 if propertyPrice, loanAmount, and interestRate are all 0', () => {
		const command: CalculateRepaymentCommand = {
			propertyPrice: 0,
			loanAmount: 0,
			interestRate: 0,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 0
		};

		const matomoDetails = {
			someDetail: 'value'
		};

		const result = useCase.execute({ command, firstUserInteraction: false, matomoDetails });
		expect(result).toBe(0);
	});

	it('should return 0 if propertyPrice and interestRate are negative', () => {
		const command: CalculateRepaymentCommand = {
			propertyPrice: -100000,
			loanAmount: 80000,
			interestRate: -5,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 30
		};
		const matomoDetails = {
			someDetail: 'value'
		};

		const result = useCase.execute({ command, firstUserInteraction: false, matomoDetails });
		expect(result).toBe(0);
	});

	it('should track calculator usage when user is first time interacts with calculator', () => {
		const command: CalculateRepaymentCommand = {
			propertyPrice: 100000,
			loanAmount: 80000,
			interestRate: 5,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 30
		};

		const matomoDetails = {
			someDetail: 'value'
		};

		useCase.execute({ command, firstUserInteraction: true, matomoDetails });
		expect(mockAnalyticsService.trackCalculatorUsage).toHaveBeenCalledWith(matomoDetails);
	});

	it('should not track calculator usage when user interacts with calculator for the second time or more', () => {
		const command: CalculateRepaymentCommand = {
			propertyPrice: 100000,
			loanAmount: 80000,
			interestRate: 5,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 30
		};

		const matomoDetails = {
			someDetail: 'value'
		};
		useCase.execute({ command, firstUserInteraction: false, matomoDetails });

		expect(mockAnalyticsService.trackCalculatorUsage).not.toHaveBeenCalled();
	});

	it('should return the monthly repayment amount at two decimal points for principal interest repayment type', () => {
		const command: CalculateRepaymentCommand = {
			propertyPrice: 150000,
			loanAmount: 150000,
			interestRate: 5.25,
			repaymentType: ERepaymentType.PRINCIPAL_INTEREST,
			savings: 0,
			loanTerm: 30
		};

		const matomoDetails = {
			someDetail: 'value'
		};

		const result = useCase.execute({ command, firstUserInteraction: false, matomoDetails });
		expect(result).toBeCloseTo(828.31, 2);
	});

	it('should return the monthly repayment amount at two decimal points for interest only repayment type', () => {
		const command: CalculateRepaymentCommand = {
			propertyPrice: 150000,
			loanAmount: 150000,
			interestRate: 5.25,
			repaymentType: ERepaymentType.INTEREST_ONLY,
			savings: 0,
			loanTerm: 30
		};

		const matomoDetails = {
			someDetail: 'value'
		};

		const result = useCase.execute({ command, firstUserInteraction: false, matomoDetails });
		expect(result).toBeCloseTo(656.25, 2);
	});

	it('should correctly calculate the repayment amount for Interest Only repayment type', () => {
		const matomoDetails = {
			someDetail: 'value'
		};

		mockDataForInterestOnly.forEach(({ command, expected }) => {
			const result = useCase.execute({ command, firstUserInteraction: false, matomoDetails });
			expect(result).toBeCloseTo(expected, 2);
		});
	});

	it('should correctly calculate the repayment amount for Principal and Interest Only repayment type', () => {
		const matomoDetails = {
			someDetail: 'value'
		};

		mockDataForPrincipalInterest.forEach(({ command, expected }) => {
			const result = useCase.execute({ command, firstUserInteraction: false, matomoDetails });
			expect(result).toBeCloseTo(expected, 2);
		});
	});
});
