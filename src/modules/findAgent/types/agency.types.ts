import { ESaleMethod, EPropertyTypes } from '@realestateview/avesta-js-core';
import { EListingStatus } from '@realestateview/avesta-js-core/dist/helpers/commonTypes';
import { EListingRank } from '@shared/types/enums';

export type AgencyRequestCommand = {
	id: number;
	mapHeight?: string;
	mapWidth?: string;
	isBot?: boolean;
};

export type AgencyStats = {
	agencyId: number;
	agencyName: string;
	totalSoldAndLeased: number;
	totalSold: number;
	totalLeased: number;
};

export type TopPerformingSuburbByAgency = {
	suburbId: number;
	totalSoldAndLeased: number;
	suburbName: string;
	postcode: string;
	state: string;
	url: string;
};

export type BedroomType = 1 | 2 | 3 | 4 | 5 | 'Any';

export type PropertyTypeFilter =
	| EPropertyTypes.house
	| EPropertyTypes.apartment
	| EPropertyTypes.townhouse
	| EPropertyTypes.unit
	| 'all';

export type TabType = ESaleMethod.sold | ESaleMethod.lease | ESaleMethod.sale;

export type Listing = {
	priceText: string;
	url: string;
	propertyTypes: string[];
	agentId: number;
	carparks?: number;
	city?: string;
	unitNumber?: string;
	rentPerWeek?: number;
	isPriceHidden?: boolean;
	isSoldPriceHidden?: boolean;
	priceFrom?: number;
	priceTo?: number;
	soldPrice?: number;
	heroImageUrl: string;
	streetName: string;
	suburbName: string;
	rank: EListingRank;
	id: number;
	state: string;
	imageUrlSlug: string;
	saleMethod: ESaleMethod;
	streetNumber?: string;
	postcode: string;
	isStreetHidden: boolean;
	soldAt?: string;
	bathrooms?: number;
	isReipListing: boolean;
	lgaName: string;
	bedrooms?: number;
	primaryPropertyType: string;
	streetAddress: string;
	gnafId?: string;
	status: EListingStatus;
	landSize?: number;
	landSizeSystem?: string;
	landSizeInSqm?: number;
};

export type AgencyDetailsProps = {
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
	description?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	youtube?: string;
	salesEmail?: string;
	rentalEmail?: string;
	salesCCEmail?: {
		email?: string;
		phone?: string;
		lastName?: string;
		firstName?: string;
	}[];
	rentalCCEmail?: {
		email?: string;
		phone?: string;
		lastName?: string;
		firstName?: string;
	}[];
	videoUrl?: string;
	isAcmAgency?: string;
	relatedSuburbs?: number[];
	isReipAgency?: boolean;
	lgaId?: number;
	lgaName?: string;
	averageDaysOnMarket?: number;
	averageLeasedDaysOnMarket?: number;
	averageSoldPrice?: number;
	averageLeasedPrice?: number;
	averageLeasedMonthPrice?: number;
	numberOfSoldListings?: number;
	numberOfLeasedListings?: number;
	numberOfBuyListings?: number;
	numberOfRentListings?: number;
	blogRssFeed?: string;
	blogUrl?: string;
	hideInFindAnAgent?: boolean;
	salesPerformanceStats?: string;
	rentPerformanceStats?: string;
	isReipListing?: boolean;
};

export type AgencyDetail = Omit<AgencyDetailsProps, 'salesPerformanceStats' | 'rentPerformanceStats'> & {
	salesPerformanceStats?: SalesPerformanceStats;
	rentPerformanceStats?: RentPerformanceStats;
};

export type SalesPerformanceStats = {
	all?: {
		numberOfSoldProperties: number;
		medianSalePrice: number;
		medianDaysOnMarket: number;
		totalSalesValue: number;
	};
	apartment?: {
		numberOfSoldProperties: number;
		medianSalePrice: number;
		medianDaysOnMarket: number;
		totalSalesValue: number;
	};
	house?: {
		numberOfSoldProperties: number;
		medianSalePrice: number;
		medianDaysOnMarket: number;
		totalSalesValue: number;
	};
	unit?: {
		numberOfSoldProperties: number;
		medianSalePrice: number;
		medianDaysOnMarket: number;
		totalSalesValue: number;
	};
};

export type RentPerformanceStats = {
	all?: {
		numberOfLeasedProperties: number;
		medianRentPrice: number;
		medianDaysOnMarket: number;
		totalRentValue: number;
	};
	apartment?: {
		numberOfLeasedProperties: number;
		medianRentPrice: number;
		medianDaysOnMarket: number;
		totalRentValue: number;
	};
	house?: {
		numberOfLeasedProperties: number;
		medianRentPrice: number;
		medianDaysOnMarket: number;
		totalRentValue: number;
	};
	unit?: {
		numberOfSoldProperties: number;
		medianSalePrice: number;
		medianDaysOnMarket: number;
		totalSalesValue: number;
	};
};

export type Agents = {
	id: number;
	firstName: string;
	lastName: string;
	agentPhotoFileName?: string;
	position: string;
	agencyId: number;
	url: string;
};

export type AgencyProfileResponse = AgencyDetail & {
	agents?: {
		total: number;
		data: Agents[];
	};
	breadcrumbs: { name: string; url?: string }[];
	seoLinks?: ProfileSeoLinks;
	topPerformingSuburbs: TopPerformingSuburbByAgency[];
	listings?: { data: Listing[]; total: number };
	staticMapImage?: string;
};

export type AgentAgencyProfile = {
	id: number;
	name: string;
	postcode: string;
	suburbId: number;
	suburbName: string;
	state: string;
	cityId: number;
	city: string;
	slug: string;
	address: string;
	brandColour: string;
	brandContrastColour: string;
	logoFileName: string;
	addressLine1: string;
	addressLine2: string | null;
	website: string;
	location: {
		lat: number;
		lon: number;
	};
	hideAddress: boolean;
	phone: string;
	isReipAgency: boolean;
	lgaId?: number;
	lgaName?: string;
};

export type Url = {
	name: string;
	url: string;
};

export type AgentProfileResponse = {
	agencyDetail?: AgentAgencyProfile;
	staticMapImage?: string;
	listings?: {
		data: Listing[];
		total: number;
	};
	breadcrumbs: Url[];
	seoLinks?: ProfileSeoLinks;
} & Omit<AgentProfile, 'salesPerformanceStats' | 'rentPerformanceStats'> & {
		salesPerformanceStats?: SalesPerformanceStats;
		rentPerformanceStats?: RentPerformanceStats;
	};

export type ProfileSeoLinks = {
	nearbySuburbs?: Url[];
	bedroom?: Url[];
	price?: Url[];
};

export type AgentProfile = {
	id: number;
	firstName: string;
	lastName: string;
	agentPhotoFileName?: string;
	position: string;
	agencyId: number;
	averageDaysOnMarket?: number;
	averageLeasedDaysOnMarket?: number;
	averageLeasedMonthPrice?: number;
	averageLeasedPrice?: number;
	averageSoldPrice?: number;
	description?: string;
	email?: string;
	facebook?: string;
	instagram?: string;
	isMobileHidden?: boolean;
	isPrimaryContact?: boolean;
	isWebHidden?: boolean;
	linkedin?: string;
	mobile?: string;
	numberOfBuyListings?: number;
	numberOfLeasedListings?: number;
	numberOfRentListings?: number;
	numberOfSoldListings?: number;
	phone?: string;
	twitter?: string;
	wechat?: string;
	salesPerformanceStats?: string;
	rentPerformanceStats?: string;
};

export type AgentProfileCommand = {
	id: number;
	saleMethod?: ESaleMethod;
	propertyType?: EPropertyTypes;
	bedrooms?: number;
	page?: number;
	size?: number;
	mapHeight?: string;
	mapWidth?: string;
};

export type ListingResponse = {
	data: Listing[];
	total: number;
};
