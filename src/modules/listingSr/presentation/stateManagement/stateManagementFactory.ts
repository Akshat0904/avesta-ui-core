import { IListingSrState } from '@listingSr/core/types/listingSrState';
import { getStateManagementStrategy } from './stateManagementConfig';
import { useListingSrContext } from './context/listingSrContext';
import { useListingSrRedux } from './redux/listingSrRedux';

const getStateManager = (): IListingSrState => {
	const strategy = getStateManagementStrategy();

	if (strategy === 'context') {
		return useListingSrContext();
	} else if (strategy === 'redux') {
		return useListingSrRedux();
	}

	return useListingSrRedux();
};

export default getStateManager;
