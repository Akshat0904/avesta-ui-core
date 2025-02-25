import { CompareProperty, ComparePropertyAnalyticsInfo } from '@searchResult/types/types';

export type AddPropertyToCompareCommand = {
	compareProperties: CompareProperty[];
	selectedProperty: CompareProperty;
};

export type RemovePropertyFromCompareCommand = {
	compareProperties: CompareProperty[];
	id: number | string;
};

export type SavePropertyToCompareGroupCommand = {
	groupId: number;
	analytics: ComparePropertyAnalyticsInfo;
	e_c: string;
	listings?: number[];
	properties?: string[];
	projectAndPropertyIds?: {
		projectId: number; // parent ID
		projectPropertiesId: number; // child ID
	}[];
};
