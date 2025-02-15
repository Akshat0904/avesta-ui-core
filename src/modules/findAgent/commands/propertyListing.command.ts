import { EPropertyTypes, ESaleMethod } from '@realestateview/avesta-js-core';

type QueryParams = {
	propertyType?: EPropertyTypes;
	page?: number;
	size?: number;
	saleMethod?: ESaleMethod;
	bedrooms?: number;
};

export type AgentPropertyListingCommand = QueryParams & {
	agentId: number;
};

export type AgencyPropertyListingCommand = QueryParams & {
	agencyId: number;
};
