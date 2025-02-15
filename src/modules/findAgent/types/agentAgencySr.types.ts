import { EPropertyTypes } from '@realestateview/avesta-js-core';
import { Url } from './agency.types';

export type AgencySearchResultRequest = {
	suburbNameSlug: string;
	postcode: string;
	state: string;
	propertyTypes?: EPropertyTypes[];
	page?: number;
	size?: number;
	sort?: any;
};

export type AgencyStats = {
	agencyId: number;
	saleCount?: number;
	rentCount?: number;
	soldCount?: number;
};

export type AgentStats = {
	agentId: number;
	soldListingCount: number;
	medianSoldPrice: number;
	medianDaysOnMarket: number;
	totalSoldListingCount: number;
};

export type AgencyProfile = {
	id: number;
	name: string;
	postcode: string;
	suburbId: number;
	suburbName: string;
	state: string;
	cityId?: number;
	city?: string;
	slug: string;
	address: string;
	brandColour?: string;
	brandContrastColour?: string;
	logoFileName?: string;
	addressLine1: string;
	addressLine2?: string;
	website?: string;
	location?: {
		lat: number;
		lon: number;
	};
	hideAddress: boolean;
	phone?: string;
	url: string;
	stats?: {
		agencyId: number;
		saleCount?: number;
		rentCount?: number;
		soldCount?: number;
	};
	isReipAgency: boolean;
	isReipListing: boolean;
	lgaName: string;
};

export type AgentProfile = {
	id: number;
	firstName: string;
	lastName: string;
	agentPhotoFileName: string;
	position: string;
	agencyId: number;
	url: string;
	agency?: AgencyProfile;
	stats?: AgentStats;
};

export type SrSeoLinks = {
	nearbySuburbs?: Url[];
	agents?: Url[];
	price?: Url[];
};

export type AgencySearchResultResponse = {
	agencies: { data: AgencyProfile[]; total: number };
	suburbDetails: SuburbProfile;
	premiumAgencies: AgencyProfile[];
	breadcrumbs: { name: string; url: string }[];
	seoLinks?: SrSeoLinks;
};

export type AgentSearchResultRequest = {
	suburbNameSlug: string;
	postcode: string;
	state: string;
	propertyTypes?: EPropertyTypes[];
	page?: number;
	size?: number;
	sort?: any;
};

export type AgentSearchResultResponse = {
	agents: { data: AgentProfile[]; total: number };
	suburbDetails: SuburbProfile;
	breadcrumbs: { name: string; url: string }[];
	seoLinks?: SrSeoLinks;
};

export type SuburbProfile = {
	suburbName: string;
	state: string;
	postcode: string;
	id: number;
};
