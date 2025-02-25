import React, { createContext, ReactNode, useContext } from 'react';

interface RootStateContextProps {
	rootStateType: any;
}

const RootStateContext = createContext<RootStateContextProps | undefined>(undefined);

export const RootStateProvider: React.FC<{ value: any; children: ReactNode }> = ({ value, children }) => {
	return <RootStateContext.Provider value={{ rootStateType: value }}>{children}</RootStateContext.Provider>;
};

export const useRootStateContext = () => {
	const context = useContext(RootStateContext);
	if (!context) {
		throw new Error('useRootStateContext must be used within a RootStateProvider');
	}
	return context.rootStateType;
};
