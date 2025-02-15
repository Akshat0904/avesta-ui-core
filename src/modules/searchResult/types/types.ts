import {
	EListingEntityType,
	EListingStatus,
	EPropertyTypes,
	ESaleMethod,
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ILocation,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import { EAlertTypes, EGridLevel, ELocationTypes, EModuleType, ESaveSearchFrequency } from '@searchResult/types/enums';
import { Listing, ListingSrPageResponse } from '@searchResult/types/listingSrResponse';

export type SrFilter = IListingSrData & ISchoolCatchmentSrUrlFromData;

export type RecentSearchLocations = RecentSearch[];

export type RecentSearch = {
	pageUrl: string;
	displayName: string[];
	saleMethod?: ESaleMethod[];
	carparks?: number;
	bathrooms?: number;
	priceFrom?: number;
	priceTo?: number;
	bedrooms?: number;
	propertyTypes?: EPropertyTypes[];
	exactBeds?: boolean;
	exactBaths?: boolean;
	exactCars?: boolean;
	isUnListed?: boolean;
	locations: ILocation[];
	landSizeTo?: number;
	landSizeFrom?: number;
	type?: EModuleType;
};

export type SaveSearch = {
	label?: string;
	saleMethod: string;
	alertType: EAlertTypes;
	priceFrom?: number;
	priceTo?: number;
	bedrooms?: number;
	bathrooms?: number;
	carSpaces?: number;
	locations?: SaveSearchLocation[];
	propertyTypes?: number[];
	sendFrequency: ESaveSearchFrequency;
	sendAlert: boolean;
	onlyProject?: boolean;
};

export type SaveSearchLocationRecord = {
	state: string;
	suburbName?: string;
	postcode?: string;
	lgaName?: string;
	coordinates: [number, number][];
	city?: string;
	lgaId?: number;
	cityId?: number;
	locationType: ELocationTypes;
	locationId: number;
	_id: string;
};

export type SaveSearchStreetRecord = {
	id: number;
	state: string;
	suburbName: string;
	streetName: string;
	streetAddress: string;
	postcode: string;
};

export type LocationSearchResultResponse = {
	response: ListingSrResponse;
	url: string;
	filters?: SrFilter;
	fromModuleType?: EModuleType;
};

export type SaveSearchLocation = {
	locationId: number;
	locationType: ELocationTypes;
	state: string;
	schoolName?: string;
	schoolId?: number;
	streetName?: string;
	streetNameSlug?: string;
};

export type SaveSearchResponse = {
	success: boolean;
};

export type SaveNote = {
	note: string;
	entityType?: EListingEntityType;
	projectPropertiesId?: number;
};

export type BoundingBox = {
	topLeftLatitude: number;
	topLeftLongitude: number;
	bottomRightLatitude: number;
	bottomRightLongitude: number;
};

export type GridResult = {
	gridIds: string[] | undefined;
	gridLevel: EGridLevel;
};

export type ListingGridIdsResponse = {
	data: ListingBySurroundedBoundariesOrGridIdsResponse;
	success: boolean;
};

export type presentationQuery = {
	response: ListingSrResponse | ListingGridIdsResponse;
	filters: IListingSrData;
	url: string;
	location?: ILocation[];
	fromModuleType?: EModuleType;
};

export type ListingBySurroundedBoundariesOrGridIdsResponse = ListingSrPageResponse & {
	suburbIds: number[];
};

export type ListingSrResponse = {
	success: boolean;
	data: ListingSrPageResponse;
};

export type ListingDetails = {
	listingIds: number[];
	saleMethod: ESaleMethod;
};

export type ListingDetailByIds = {
	success: boolean;
	data: Listing[];
};

export type GridDetails = BoundingBox & {
	gridIds?: string[];
	gridLevel?: string;
};

export type LandSystem = {
	landSize: number;
	landSizeSystem?: string;
};

export type CompareProperty = {
	id: number | string;
	imageUrl?: string;
	imageUrlSlug: string;
	heroImageUrl?: string;
	gnafId?: string;
	priceText: string;
	address: string;
	propertyType: string;
	bedrooms: number;
	bathroom: number;
	carParks: number;
	land: LandSystem;
	auctionDate?: string;
	inspectionDate?: string;
	saleMethod?: ESaleMethod;
	status?: EListingStatus | 'Unlisted';
	url: string;
	location?: {
		lon: number;
		lat: number;
	};
	entityType?: EListingEntityType;
	projectProfileId?: number | string;
	externalImageUrl?: boolean;
};

export type ComparePropertyGroupDetails = {
	listingsCount: number;
	id: number;
	name: string;
	slug: string;
};

export type ComparePropertyAnalyticsInfo = {
	VisitorId: string;
	UserId?: string;
	UserAgent: string;
	DeviceResolution: string;
	VisitCount?: string;
	Url: string;
	UrlRef: string;
	PreviousVisitTs: string;
	FirstVisitTs: string;
	IpAddress: string;
};
export type AnalyticsData = {
	visitorId: string;
	deviceResolution: string;
	url: string;
	urlRef: string;
	previousVisitTs: string;
	firstVisitTs: string;
	userAgent: string;
	ipAddress: string;
	visitCount?: string;
	userId?: string;
};

export type ListingEnquiryModalApiResponse = {
	success: boolean;
	data?: string;
	err?: any;
};

export type AgentEnquiryApiBody = {
	listingId: number;
	email: string;
	lastName: string;
	firstName: string;
	message?: string;
	phoneNumber?: string;
	emailType: string;
	analytics: {
		DeviceResolution: string;
		FirstVisitTs: string;
		PreviousVisitTs: string;
		Url: string;
		UrlRef: string;
		UserId?: string;
		VisitorId: string;
		VisitCount?: string;
		IpAddress: string;
		UserAgent: string;
	};
	EnquiryFromPage: string;
	saleMethod: string;
};

export type EnquiryToAgentApiResponse = {
	success: boolean;
	data?: string;
	err?: any;
};

export type EnquiryToAgentApiBody = {
	listingId: number;
	email: string;
	lastName: string;
	firstName: string;
	message?: string;
	phoneNumber?: string;
	emailType: string;
	analytics: {
		DeviceResolution: string;
		FirstVisitTs: string;
		PreviousVisitTs: string;
		Url: string;
		UrlRef: string;
		UserId?: string;
		VisitorId: string;
		VisitCount?: string;
		IpAddress: string;
		UserAgent: string;
	};
	EnquiryFromPage: string;
	saleMethod: string;
};
