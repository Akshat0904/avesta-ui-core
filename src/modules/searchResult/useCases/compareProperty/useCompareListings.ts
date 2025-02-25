import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '@listingSr/presentation/stateManagement/stateManagementFactory';
import { CompareProperty, ComparePropertyGroupDetails } from '@searchResult/types/types';
import { useServices } from '@shared/hooks/useServices';
import { useState } from 'react';

export const useCompareListings = () => {
	const {
		addPropertyToCompareUseCase,
		removePropertyFromCompareUseCase,
		removeAllPropertiesFromCompareUseCase,
		getCompareGroupsListUseCase
	} = useServices();

	const stateManager: IListingSrState = getStateManager();

	const compareProperties = stateManager.useCompareProperties();

	const setCompareProperties = stateManager.useSetCompareProperties();

	const [groupList, setGroupList] = useState<ComparePropertyGroupDetails[]>([]);

	const [groupId, setGroupId] = useState<number>(0);

	const executeAddPropertyToCompare = (command: CompareProperty) => {
		const comparableProperties = addPropertyToCompareUseCase.execute({
			compareProperties,
			selectedProperty: command
		});
		comparableProperties && setCompareProperties(comparableProperties);
	};

	const executeRemovePropertyFromCompare = (id: string | number) => {
		const updatedProperties = removePropertyFromCompareUseCase.execute({
			compareProperties,
			id
		});

		setCompareProperties(updatedProperties);
	};

	const executeRemoveAllPropertyFromCompare = () => {
		removeAllPropertiesFromCompareUseCase.execute();
		setCompareProperties([]);
	};

	const executeGetComparePropertyGroupsList = async () => {
		const response = await getCompareGroupsListUseCase.execute();
		response && setGroupList(response);
	};

	return {
		groupList,
		groupId,
		setGroupId,
		executeAddPropertyToCompare,
		executeRemovePropertyFromCompare,
		executeRemoveAllPropertyFromCompare,
		executeGetComparePropertyGroupsList
	};
};
