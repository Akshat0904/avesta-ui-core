import { EGroupIcon } from '@shared/types/enums';
import { EFindAgentEnquiryType } from './enum';

export type LocationsAndAgenciesSearchResponse = {
	locations: LocationSearchResponse[];
	agencies: AgencySearchResponse[];
	agents: AgentSearchResponse[];
};

type LocationSearchResponse = LocationSearchESQueryRes & {
	displayText: string;
};
export type LocationSearchESQueryRes = {
	locationType: string;
	state: string;
	stateFullName: string;
	city?: string;
	region?: string;
	suburbName?: string;
	postcode?: string;
	lgaName?: string;
	locationId: number;
	regionId?: number;
	cityId?: number;
	aliasSuburbs?: { name: string; postcode: string }[];
	aliasSearchName?: string[];
};

export type AgencySearchResponse = {
	id: number;
	slug: string;
	name: string;
	displayText: string;
	isReipAgency: boolean;
};
export type AgentSearchResponse = {
	id: number;
	firstName: string;
	lastName: string;
	displayText: string;
};

export type OptionItem = {
	id: string;
	displayText: string;
	downshiftItemIndex: number;
	data?: any;
};

export type GroupSearchSuggestion = {
	groupIconType: EGroupIcon;
	groupId: string;
	groupLabel: string;
	optionsList: OptionItem[];
};

export type SearchSuggestionResponse = {
	data: LocationsAndAgenciesSearchResponse;
	success: string;
};

export type CommonEnquiryRequest = {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
};

export type ILeadAnalyticsParams = {
	visitorId: string;
	userAgent: string;
	deviceResolution: string;
	visitCount?: string;
	url: string;
	userId?: string;
	urlRef: string;
	previousVisitTs: string;
	firstVisitTs: string;
	ipAddress: string;
};

export type FindAgentAppraisalRequest = CommonEnquiryRequest & {
	IsPropertyOwner: boolean;
	GnafId: string;
	Slug: string;
	Portal: string;
	Analytics: ILeadAnalyticsParams;
};

export type FindAgentEnquiryRequest = CommonEnquiryRequest & {
	enquiryType: EFindAgentEnquiryType;
	analytics: any;
};

export type SendAppraisalResponse = {
	success: boolean;
	message: string;
};

export type PropertyResponse = {
	state: string;
	lgaId: number;
	suburbId: number;
	streetId: number;
	gnafId: string;
	address: string;
	unitNumber: string;
	streetNumberFirst: string;
	streetNumber: string;
	seoSlug: string;
	streetSlug?: string;
	locationId: number;
	confidence: number;
	latitude: number;
	longitude: number;
	sa1Code: string;
	previousAddressSlug: string;
	nextAddressSlug: string;
	existsInCorelogic: string;
	lgaName: string;
	suburbName: string;
	streetName: string;
	streetAbv: string;
	postcode: string;
	streetTypeCode: string;
	streetAddress: string;
	previousAddress: string;
	nextAddress: string;
	_id: string;
	title?: string;
	city?: string;
	projectSlug?: string;
};

export type PropertyGroupSearchSuggestion = {
	groupIconType: EGroupIcon;
	groupId: string;
	groupLabel: string;
	optionsList: OptionItem[];
};

export type LocationScope = {
	excludeState: boolean;
	excludeRegion?: boolean;
	excludeLga?: boolean;
	excludeCity: boolean;
	stateWiseSuburbs?: string[];
};

export type ScopeOptions = {
	excludeLocations: boolean;
	excludeStreets: boolean;
	excludeProperties: boolean;
	excludeProject: boolean;
	excludeSchool?: boolean;
	locationScope?: LocationScope;
};

export type ExcludeLocationSearch = {
	locationId?: number;
	locationType: string;
	state: string;
};

export type PropertySearchSuggestionResponse = {
	data: PropertyResponse[];
	success: string;
};
