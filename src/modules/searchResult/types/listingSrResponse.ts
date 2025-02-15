import { EListingEntityType, EListingStatus, ESaleMethod } from '@realestateview/avesta-js-core';
import { EListingRank, ELocationTypes } from '@searchResult/types/enums';
import { EPropertyImageSource } from '@shared/types/enums';

export type ListingSrPageResponse = {
	listings: Listing[];
	pins: PinListing[];
	schoolInfo?: SchoolInfoEsRes[];
	p360Properties: {
		total: number;
		data: PinP360[];
	};
	localExpert?: LocalExpertAgency;
	seoDescription: string;
	seoLinks?: SeoLinks;
	suburbProfile?: SuburbProfile;
	lgaProfile?: LgaProfile;
	auctionResult?: string;
	breadCrumbs?: Breadcrumb[];
	agentBanner?: AgentBanner;
	locationESRecords?: LocationRecord[];
	streetESRecords?: StreetRecord[];
	appliedFilters?: {
		filters: string[];
		redirectUrl: string;
	};
	pinsTotal: number;
	filterTotal: number;
	size: number;
	rentOrSaleCount?: number;
};

export type LocationRecord = {
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

export type StreetRecord = {
	id: number;
	state: string;
	suburbName: string;
	streetName: string;
	streetAddress: string;
	postcode: string;
};

export type AgentBanner = {
	fileName: string;
	webLink: string;
	agencyId: number;
	isReipAgency?: boolean;
};

export type Breadcrumb = {
	displayName: string;
	urlPath?: string;
};

export interface LgaProfile {
	link: string;
}

export type SuburbProfile = {
	link: string;
	profileImage?: string;
};

export type SeoLinks = {
	bedrooms: Link[];
	popularSuburb: Link[];
	popularAgencies: Link[];
	footerSeoLinks?: DynamicFooterLinks;
	price?: Link[];
};

export interface DynamicFooterLinks {
	sale?: Link[];
	rent?: Link[];
	neighboringSuburb?: Link[];
	neighbouringSchools?: Link[];
	agencySearchResult?: Link;
	newDevelopmentSearchResult?: Link;
}

export type Link = {
	name: string;
	url: string;
	matomoEventAction?: string;
	isReipAgency?: boolean;
};

export type LocalExpertAgency = {
	listings: LocalExpertListing[];
	agencyBrandColour?: string;
	agencyProfileLink: string;
	agencyLogo: string;
	agencyName: string;
	agencyBrandContrastColour: string;
	isReipAgency?: boolean;
};

export type LocalExpertListing = {
	imageUrlSlug: string;
	saleMethod: ESaleMethod;
	id: number;
	streetAddress: string;
	priceText: string;
	rank: EListingRank;
	agencyId: number;
	agentId: number[];
	state: string;
	bathrooms: number;
	bedrooms: number;
	heroImageUrl: string;
	agentPhotoFileName: string;
	detailLink: string;
	carparks: number;
	suburbName: string;
	postcode: string;
	primaryPropertyType: string;
	propertyTypes?: string[];
	city?: string;
	lgaName?: string;
	agentFirstName: string;
	agentLastName: string;
	status: EListingStatus;
	isStreetHidden: boolean;
	unitNumber?: string;
	streetNumber?: string;
	isReipAgency?: boolean;
	isReipListing?: boolean;
};

export type PinP360 = {
	gnafId: string;
	avmHigh: number;
	avmLow: number;
	avmConfidenceBand: string;
	seoSlug: string;
	image: P360Image;
	bathrooms?: number;
	bedrooms?: number;
	carSpaces?: number;
	location?: LocationCoordinates;
	postcode: string;
	propertyType?: string;
	state: string;
	streetAddress: string;
	streetName: string;
	streetNo?: string;
	suburbName: string;
	unitNo?: string;
	detailUrl: string;
	isRecentlyViewed?: boolean;
	sa1Code?: string;
	isShortListed?: boolean;
	isListing: false;
	imageSource: EPropertyImageSource;
};

export type LocationCoordinates = {
	lat: number;
	lon: number;
};

export type P360Image = { google?: string; photo?: string; coreLogic?: string };

export interface SchoolInfoEsRes {
	id: number;
	full_name: string;
	schoolName?: string;
	schoolNameSlug: string;
	school_level?: string;
	organisation_type_id: number;
	rev_organisation_name?: string;
	type?: string;
	gender?: string;
	religion?: string;
	year_level?: string;
	suburb: string;
	postcode: string;
	state_code: string;
	state: string;
	suburbNameSlug: string;
	isBoundaryHidden?: boolean;
	link?: string;
	location: {
		lat: number;
		lon: number;
	};
	bounds: {
		coordinates?: [number, number][];
	};
	coordinates?: [number, number][];
	suburbName?: string;
}

export type PinListing = ListingBase & {
	weightage: number;
	smallGridId: string;
	largeGridId: string;
	heroImageUrl: string;
	streetName: string;
	mediumGridId: string;
	gnafId: string;
	listingDetailLink: string;
	note?: string;
	noteId?: number;
	createdAt: string;
	updatedAt: string;
	agency?: ListingAgency;
	isReipListing?: boolean;
};

export type ListingAgency = {
	id: number;
	name: string;
	brandContrastColour?: string;
	logoFileName: string;
	brandColour: string;
	agencyProfileLink?: string;
	isReipAgency?: boolean;
};

export type Listing = ListingBase & {
	weightage: number;
	inspections: ListingInspections[];
	recurringInspections?: ProjectRecurringInspections[];
	updatedAt: Date;
	createdAt: Date;
	onMarketAt: Date;
	inspectionId?: number;
	images?: ListingImage[];
	floorPlans?: ListingFloorPlan[];
	agency?: ListingAgency;
	agents?: ListingAgent[];
	listingDetailLink: string;
	addToCalendarFileUrl?: string;
	heroImageUrl?: string;
	note?: string;
	noteId?: number;
	isReipListing?: boolean;
};

export type ListingAgent = {
	id: number;
	firstName: string;
	lastName: string;
	agentPhotoFileName: string;
	mobile: string;
	isMobileHidden: boolean;
	phone?: string;
	email: string;
	agentProfileLink?: string;
	numberOfSoldListings?: number;
	averageSoldPrice?: number;
	position?: string;
};

export type ListingFloorPlan = {
	type: string;
	fileName: string;
	sequence: number;
};

export type ListingImage = {
	url: string;
	sequence: number;
};

export type ProjectRecurringInspections = {
	id: number;
	timeStart: string;
	timeEnd: string;
	weekDays: number[];
	calenderUrl?: string;
	appointmentOnly?: boolean;
};

export type ListingInspections = {
	id: number;
	endAt: string;
	startAt: string;
	calenderUrl?: string;
	appointmentOnly?: boolean;
};

type ListingBase = {
	adProjectId?: string;
	projectId?: string;
	developmentContactNo?: string;
	imageUrlSlug: string;
	entityType?: EListingEntityType;
	properties?: Properties[];
	title?: string;
	newDevelopmentLink?: string;
	id: number;
	agencyId: number;
	agentId: number[];
	soldAt?: string;
	inspectionStart?: string;
	inspectionEnd?: string;
	isPriceHidden: boolean;
	priceText: string;
	auctionAt?: string;
	bathrooms: number;
	bedrooms: number;
	carparks: number;
	bathroomText?: string;
	studyroomText?: string;
	bedroomText?: string;
	carparkText?: string;
	landSize?: number;
	landSizeSystem?: string;
	status: EListingStatus;
	isStreetHidden: boolean;
	suburbName: string;
	postcode: string;
	primaryPropertyType: string;
	propertyTypes: string[];
	rank: EListingRank;
	streetAddress: string;
	state: string;
	streetNumber?: string;
	city?: string;
	lgaName?: string;
	unitNumber?: string;
	location: LocationCoordinates;
	updatedText?: string;
	saleMethod: ESaleMethod;
	isRecentlyViewed?: boolean;
	streetName?: string;
	gnafId?: string;
	_id?: string;
	isListing: true;
	isShortListed?: boolean;
	priceFrom: number;
	isSoldPriceHidden?: boolean;
	soldPrice?: number;
	rentPerWeek: number;
	projectSlug?: string;
	landSizeInSqm?: number;
};

export type Properties = {
	studyrooms: number;
	carparks: number;
	city?: string;
	inspections?: ListingInspections[];
	unitNumber?: string;
	cityId?: number;
	title: string;
	heroImageUrl: string;
	createdAt: string;
	titleSlug: string;
	streetName: string;
	suburbName: string;
	areaTotal: number;
	landSize: number;
	priceFrom: number;
	adPropertyId: string;
	propertyType?: string;
	propertySlug: string;
	streetNameSlug: string;
	id: number;
	state: string;
	suburbNameSlug: string;
	priceTo: number;
	imageUrlSlug: string;
	priceText: string;
	landSizeInSqm: number;
	suburbId: number;
	lgaId: number;
	streetNumber: string;
	postcode: string;
	isStreetHidden: boolean;
	listingId: number;
	bathrooms: number;
	lgaName: string;
	isHidden: boolean;
	bedrooms: number;
	lgaSlug: string;
	citySlug: string;
	landSizeSystem: string;
	streetAddress: string;
	isUnitNumberHidden: boolean;
	listingDetailLink: string;
	fullAddress: string;
	isShortListed?: boolean;
	note?: string;
	noteId?: number;
	developmentContactNo?: string;
};
