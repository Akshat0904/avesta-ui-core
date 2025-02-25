import { StateManagementType } from '@shared/types/types';

let stateManagementStrategy: StateManagementType = 'redux';

export const setStateManagementStrategy = (strategy: StateManagementType) => {
	stateManagementStrategy = strategy;
};

export const getStateManagementStrategy = (): StateManagementType => stateManagementStrategy;
