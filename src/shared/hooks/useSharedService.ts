import { useContext } from 'react';
import { SharedContext } from '../context/sharedServiceContext';
export const useSharedService = () => {
	const context = useContext(SharedContext);
	if (!context) {
		throw new Error('useSharedService must be used within a ServiceProvider');
	}
	return context;
};
