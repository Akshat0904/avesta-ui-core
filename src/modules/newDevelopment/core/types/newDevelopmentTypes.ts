import {
	EListingStatus,
	EPropertyTypes,
	ESaleMethod,
	IProjectChildListingDataFromUrl,
	IProjectDetailDataFromUrl
} from '@realestateview/avesta-js-core';
import { EListingRank, EStates } from '@shared/types/enums';
import { ELeadsEnquiryPreferredContactMethod } from './newDevelopmentEnum';
import { TDynamicFooterLinks, TListingFloorPlan, TListingImage } from '@listingSr/core/types/listingSrTypes';
import {
	TAreaLivabilityScore,
	TBreadcrumb,
	TClDisclaimers,
	TGetGovPlaningAndZones,
	TGovPlaningAndZonesResponse,
	TLocationCoordinates,
	TNearbySchoolsRevRes,
	TSuburbTrendsResponse
} from '@shared/types/types';

export type TNewDevParentDetailParams = {
	mapHeight: string;
	mapWidth: string;
} & IProjectDetailDataFromUrl;

export type TNewDevChildDetailParams = {
	mapHeight: string;
	mapWidth: string;
} & IProjectChildListingDataFromUrl;

export type TInvestmentPropertyParams = {
	state?: string;
	bedrooms?: number;
	excludeBestInvestments?: boolean;
	excludeFeaturedInvestments?: boolean;
};

export type THomePageResponse = {
	data: TProjectHomeDetails;
	success: boolean;
};

export type TProjectHomeDetails = {
	featuredInvestmentProject: TInvestmentPropertiesDetail[];
	bestInvestmentProject: TInvestmentPropertiesDetail[];
};

export type TInvestmentPropertiesDetail = {
	adProjectId: string;
	projectId: number;
	title: string;
	propertyTypes: EPropertyTypes[];
	unitNumber?: number;
	suburbName: string;
	id: number;
	state: EStates;
	priceTo?: number;
	streetNumber?: number;
	postcode: number;
	bathrooms?: number;
	maxBathrooms?: number;
	bedrooms?: number;
	maxBedrooms?: number;
	primaryPropertyType: string;
	projectSlug?: string;
	city: string;
	lgaName: string;
	carparks?: string;
	maxCarparks?: string;
	heroImageUrl?: string;
	priceFrom: number;
	imageUrlSlug: string;
	streetAddress: string;
	streetName: string;
	bedroomText: string;
	bathroomText: string;
	carparkText: string;
	images: { url: string; index: number }[];
	priceText?: string;
	detailUrl?: string;
	isShortListed?: boolean;
	developmentContactNo: string;
};

export type TNewDevEnquiryFormData = TNewDevEnquiryFormInputFields &
	TOtherEnquiryFormData &
	TNewDevEnquiryFormCheckboxOptions &
	TNewDevEnquiryFormDropDownOptions &
	TNewDevAdditionalProps;

export type TNewDevAdditionalProps = {
	adProjectId?: string;
	adPropertyId?: string;
	projectId?: number | string;
	childId?: number;
	developmentEnquiryType?: string;
	developmentImageURL?: string;
	developmentName?: string;
	developmentAddress?: TInquiryDevelopmentAddress;
	matomoUrl?: string;
	developmentType?: string;
	developmentFullAddress?: string;
	developmentURL?: string;
	developmentContactNo?: string;
	brochureURL?: string;
	floorPlanURL?: string;
	bathRooms?: string;
	carSpaces?: string;
	bedRooms?: string;
};

type TInquiryDevelopmentAddress = {
	suburb: string;
	postalCode: number;
	state: string;
	city: string;
};

export type TNewDevEnquiryFormInputFields = {
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
	postcode?: string;
	message?: string;
};

export type TNewDevEnquiryFormCheckboxOptions = {
	isScheduleInspectionEnquiry?: boolean;
	isPriceInformationEnquiry?: boolean;
	isRequestFloorplansEnquiry?: boolean;
	isProjectBrochureEnquiry?: boolean;
};

export type TNewDevEnquiryFormDropDownOptions = {
	contactMethod?: ELeadsEnquiryPreferredContactMethod;
	audience?: string;
	priceRange?: string;
	buyingDuration?: string;
	isFinancePreApproved?: string | boolean;
};

export type TOtherEnquiryFormData = {
	portal?: string;
	analytics?: IAnalytics;
	projectBrouchure?: boolean;
};

interface IAnalytics {
	visitorId?: string;
	deviceResolution?: string;
	url?: string;
	urlRef?: string;
	previousVisitTs?: string;
	firstVisitTs?: string;
	userId?: string;
	userAgent?: string;
	visitCount?: string;
	ipAddress?: string;
}

export type TEnquiryFormResponse = {
	success: boolean;
	data: { message: string };
};

export type TProjectChildDetails = {
	adPropertyId?: string;
	id: number;
	description?: string;
	descriptionTitle?: string;
	bedrooms?: number;
	bathrooms?: number;
	carparks?: number;
	priceFrom: number;
	priceTo?: number;
	studyrooms?: number;
	propertyType: string;
	postcode: string;
	streetAddress: string;
	streetName: string;
	suburbId: number;
	suburbName: string;
	lgaId?: number;
	lgaName?: string;
	city?: string;
	cityId?: number;
	state: string;
	streetNumber?: string;
	title: string;
	createdAt: Date;
	heroImageUrl?: string;
	images?: TListingImage[];
	floorPlans?: TListingFloorPlan[];
	isHidden: boolean;
	priceText?: string;
	detailUrl?: string;
	brochureUrl?: string;
	isStreetHidden: boolean;
};

export type TProjectRecurringInspections = {
	id: number;
	timeStart: string;
	timeEnd: string;
	weekDays: number[];
	calenderUrl?: string;
	appointmentOnly?: boolean;
};

export type TProjectDisplaySuiteDetails = {
	location: TLocationCoordinates;
	suburbName: string;
	postcode: string;
	state: string;
	streetName?: string;
	streetNumber?: number;
	cityId?: number;
	city?: string;
	lgaId?: number;
	lgaName?: string;
};

export type TProjectSupplierDetails = {
	id: string;
	businessName: string;
	contactName: string;
	salesEmail: string;
	website?: string;
	contactNumber: string;
	type: string;
	status: string;
	updatedAt: string;
};

type TProjectOwnerDetails = {
	id: string;
	businessName: string;
	contactName: string;
	salesEmail: string;
	website?: string;
	contactNumber: string;
	type: string;
	status: string;
	updatedAt: string;
};

export type TSimilarListingAgency = {
	id: number;
	address: string;
	name: string;
	brandContrastColour?: string;
	logoFileName: string;
	brandColour: string;
	agencyProfileLink?: string;
	hideInFindAnAgent: boolean;
	hideMakeAnOffer: boolean;
	hidePropertyReview: boolean;
	slug: string;
};

export type TSimilarListings = {
	agency: TSimilarListingAgency;
	agencyId: number;
	agentId: number[];
	agents: {
		agentPhotoFileName: string;
		agentProfileLink: string;
		email: string;
		firstName: string;
		id: number;
		isMobileHidden: boolean;
		isWebHidden: boolean;
		lastName: string;
		mobile: string;
		phone: string;
		position: string;
	}[];
	bathrooms: number;
	bedrooms: number;
	carparks: number;
	gnafId: string;
	heroImageUrl: string;
	id: number;
	imageUrlSlug: string;
	images: TListingImage[];
	isPriceHidden: boolean;
	isStreetHidden: boolean;
	listingDetailLink: string;
	postcode: string;
	priceText: string;
	primaryPropertyType: string;
	propertyTypes: string[];
	rank: EListingRank;
	saleMethod: ESaleMethod;
	state: string;
	status: EListingStatus;
	streetAddress: string;
	streetName: string;
	streetNumber: string;
	suburbName: string;
	unitNumber: string;
	updatedAt: Date;
};

export type TListingInspections = {
	id: number;
	endAt: string;
	startAt: string;
	calenderUrl?: string;
	appointmentOnly?: boolean;
};

export type TResWithPagination<T> = {
	total: number;
	data: T[];
};

export type TListingEsSmall = {
	imageUrlSlug: string;
	id: number;
	//listingId: number;
	agencyId: number;
	agentId: number[];
	inspectionStart?: string;
	inspectionEnd?: string;
	isPriceHidden: boolean;
	priceText: string;
	bathrooms: number;
	bedrooms: number;
	carparks: number;
	suburbName: string;
	postcode: string;
	heroImageUrl: string;
	primaryPropertyType: string;
	propertyTypes: string[];
	rank: EListingRank;
	neighbouringSuburb: number[];
	inspections: TListingInspections[];
	streetAddress: string;
	state: string;
	streetNumber?: string;
	unitNumber?: string;
	location: TLocationCoordinates;
	updatedAt: Date;
	createdAt: Date;
	onMarketAt: Date;
	updatedText: string;
	inspectionId?: number;
	status: string;
	auctionAt: Date;
	listingDetailLink: string;
	isStreetHidden: boolean;
};

export type TListingAgency = {
	id: number;
	address: string;
	name: string;
	brandContrastColour?: string;
	logoFileName: string;
	brandColour: string;
	agencyProfileLink?: string;
	hideInFindAnAgent: boolean;
	hideMakeAnOffer: boolean;
	hidePropertyReview: boolean;
};

export type TListingAgent = {
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

export type TListingAndNdDetailPageResponse = {
	parentTitle?: string;
	developmentContactNo?: string;
	isUnitNumberHidden?: boolean;
	parentHeroImageUrl?: string;
	parentDetailLink?: string;
	parentPriceText?: string;
	adProjectId?: string;
	adPropertyId?: string;
	childId?: number;
	totalProperties?: number;
	title?: string;
	propertyTypes?: string[];
	cityId?: number;
	createdAt?: Date;
	priceTo?: number;
	projectSlug?: string;
	updatedAt?: Date;
	lgaId?: number;
	completionDate?: string;
	isPriceHidden?: boolean;
	priceFrom?: number;
	onMarketAt?: Date;
	suburbId?: number;
	streetName?: string;
	bedroomText?: string;
	bathroomText?: string;
	carparkText?: string;
	landSizeInSqm?: number;
	brochureUrl?: string;
	properties?: TProjectChildDetails[];
	recurringInspections?: TProjectRecurringInspections[];
	displaySuite?: TProjectDisplaySuiteDetails;
	suppliers?: TProjectSupplierDetails[];
	owner?: TProjectOwnerDetails;
	descriptionTitle?: string;
	studyrooms?: number;
	maxStudyrooms?: number;
	studyroomText?: string;
	parentBathroomText?: string;
	parentBedroomText?: string;
	parentCarparkText?: string;
	councilName?: string;
	projectId?: number | string;
	imageUrlSlug: string;
	soldAt: string;
	availableAt: string;
	id: number;
	agentId: number[];
	agencyId: number;
	auction?: { date: string; calenderUrl: string };
	suburbProfile: {
		link: string;
		profileImage: string;
	};
	statementOfInfo?: {
		type: string;
		fileName: string;
		sequence: number;
	}[];
	floorPlans?: {
		type: string;
		fileName: string;
		sequence: number;
		position?: number;
		textAlternative?: string;
		url?: string;
	}[];
	similarListings: TSimilarListings[];
	heading: string;
	priceText?: string;
	bathrooms: number;
	bedrooms: number;
	featureList: string[];
	carparks: number;
	saleMethod: ESaleMethod;
	heroImageUrl: string;
	status: string;
	state: string;
	suburbName: string;
	city: string;
	postcode: string;
	primaryPropertyType: EPropertyTypes;
	streetAddress: string;
	description: string;
	inspections: TListingInspections[];
	agencyListings: TResWithPagination<TListingEsSmall>;
	images?: TListingImage[];
	virtualTourURL: string;
	makeAnOffer: boolean;
	rank: EListingRank;
	emagURL: string;
	externalURL: string;
	externalURL2: string;
	videoURL: string;
	location: TLocationCoordinates;
	staticMapUrl: string;
	suburbTrends: TSuburbTrendsResponse;
	gnafId?: string;
	agency?: TListingAgency;
	agents?: TListingAgent[];
	streetNumber?: string;
	unitNumber?: string;
	region?: string;
	lgaName?: string;
	breadCrumbs?: TBreadcrumb[];
	landSize?: number;
	landSizeSystem?: string;
	updatedText: string;
	pdfLink: string;
	printBrochureURL?: string;
	ldJson: string;
	isStreetHidden: boolean;
	govPlaningAndZones?: TGetGovPlaningAndZones;
	areaLivabilityScore?: TAreaLivabilityScore;
	ClDisclaimers?: TClDisclaimers;
	footerSeoLinks: TDynamicFooterLinks;
	nearbySchoolsRev: TNearbySchoolsRevRes;
	onMarketDetails?: {
		id: number;
		url: string;
		saleMethod: ESaleMethod;
		postcode: string;
		propertyTypes?: string[];
		rank?: EListingRank;
		state: string;
		status?: EListingStatus;
		streetName?: string;
		streetNumber?: string;
		suburbName?: string;
		unitNumber?: null;
	};
};
