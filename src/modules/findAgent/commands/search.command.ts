import { EAgentAgencyTab } from '@findAgent/types/enum';
import { EPropertyTypes } from '@realestateview/avesta-js-core';

export type AgentAgencySearchCommand = {
	activeTab: EAgentAgencyTab;
	suburbNameSlug: string;
	postcode: string;
	state: string;
	propertyTypes?: EPropertyTypes[];
	page?: number;
	size?: number;
	sort?: any;
};
