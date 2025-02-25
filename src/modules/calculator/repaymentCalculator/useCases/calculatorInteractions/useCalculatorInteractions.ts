import { useEffect, useState, useRef } from 'react';
import { ECalculatorPageType, ERepaymentType } from '../../types/enums';
import { DefaultCalculatorHookCommand } from '../../commands/calculator.command';
import { useSharedService } from '@shared/hooks/useSharedService';
import { RepaymentCalculatorMapper } from '@calculator/repaymentCalculator/mappers/repaymentCalculator.mapper';
import { CalculatorInteractionsUseCase } from './calculatorInteractions.usecase';

type TUseCalculatorInteractions = {
	initialValues: DefaultCalculatorHookCommand;
	pageType: ECalculatorPageType;
	matomoDetails?: any;
};

export const useCalculatorInteractions = (command: TUseCalculatorInteractions) => {
	const { listingCalculatorAnalyticsService, repaymentCalculatorService, p360CalculatorAnalyticsService } =
		useSharedService();

	const { initialValues, pageType, matomoDetails } = command;

	const [propertyPrice, setPropertyPrice] = useState<number>(initialValues.propertyPrice || 0);
	const [savings, setSavings] = useState<number>(initialValues.savings || 0);
	const [loanAmount, setLoanAmount] = useState<number>(initialValues.loanAmount || 0);
	const [interestRate, setInterestRate] = useState<string>(initialValues.interestRate || '');
	const [loanTerm, setLoanTerm] = useState<string>(initialValues.loanTerm || '');
	const [repaymentType, setRepaymentType] = useState<ERepaymentType>(
		initialValues.repaymentType || ERepaymentType.PRINCIPAL_INTEREST
	);
	const [monthlyRepayment, setMonthlyRepayment] = useState<number>(0);
	const [hasInteracted, setHasInteracted] = useState(true);

	const hasMounted = useRef(false);

	useEffect(() => {
		if (hasMounted.current) {
			repaymentPageTypeStrategy(true);
			setHasInteracted(false);
		} else {
			hasMounted.current = true;
		}
	}, [hasInteracted]);

	useEffect(() => {
		repaymentPageTypeStrategy(false);
	}, [propertyPrice, savings, loanAmount, interestRate, loanTerm, repaymentType]);

	const getInteractionCommand = () => {
		const command = {
			interestRate,
			loanTerm,
			loanAmount,
			repaymentType,
			savings,
			propertyPrice
		};
		return RepaymentCalculatorMapper.toCalculateRepaymentCommand(command);
	};

	const repaymentPageTypeStrategy = (isFirstInteraction: boolean) => {
		if (pageType === ECalculatorPageType.LISTING) {
			executeMonthRepaymentListing(isFirstInteraction);
		} else {
			executeMonthlyRepaymentP360(isFirstInteraction);
		}
	};

	const executeRepayment = (isFirstInteraction: boolean, isListing: boolean) => {
		const command = getInteractionCommand();

		const interactionsCommand = {
			command,
			firstUserInteraction: isFirstInteraction,
			matomoDetails
		};

		const calculatorInteractionsUseCase = new CalculatorInteractionsUseCase(
			repaymentCalculatorService,
			isListing ? listingCalculatorAnalyticsService : p360CalculatorAnalyticsService
		);

		const monthlyRepay = calculatorInteractionsUseCase.execute(interactionsCommand);
		setMonthlyRepayment(monthlyRepay);
	};

	const executeMonthRepaymentListing = (isFirstInteraction: boolean) => {
		executeRepayment(isFirstInteraction, true);
	};

	const executeMonthlyRepaymentP360 = (isFirstInteraction: boolean) => {
		executeRepayment(isFirstInteraction, false);
	};

	return {
		propertyPrice,
		savings,
		loanAmount,
		interestRate,
		loanTerm,
		repaymentType,
		monthlyRepayment,
		hasInteracted,
		executeMonthRepaymentListing,
		executeMonthlyRepaymentP360,
		setInterestRate,
		setLoanTerm,
		setLoanAmount,
		setSavings,
		setPropertyPrice,
		setRepaymentType,
		setHasInteracted
	};
};
