import React, { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ListingSrProvider as ContextProvider } from './context/listingSrContext';
import { RootStateProvider } from './redux/rootStateContext';
import { TListingSrHookInitialData } from '@listingSr/core/types/listingSrTypes';
import { StateManagementType } from '@shared/types/types';

interface StateManagementProviderProps {
	type: StateManagementType;
	children: ReactNode;
	store?: any;
	rootStateType?: any;
	initialData?: Partial<TListingSrHookInitialData>;
}

const StateManagementProvider: React.FC<StateManagementProviderProps> = ({
	type,
	children,
	store,
	rootStateType,
	initialData
}) => {
	switch (type) {
		case 'redux':
			return (
				<ReduxProvider store={store}>
					<RootStateProvider value={rootStateType}>{children}</RootStateProvider>
				</ReduxProvider>
			);
		case 'context':
			return <ContextProvider initialData={initialData}>{children}</ContextProvider>;

		default:
			throw new Error(`Unknown state management type: ${type}`);
	}
};

export default StateManagementProvider;
