import {
	EListingEntityType,
	EListingStatus,
	ESaleMethod,
	IListingSrData,
	ILocation,
	ISchoolCatchmentSrUrlFromData
} from '@realestateview/avesta-js-core';
import {
	EGroupIcon,
	EGroupLabel,
	EListingRank,
	ELocationTypes,
	EPropertyImageSource,
	EModuleType
} from '@shared/types/enums';
import {
	TLocationCoordinates,
	TBreadcrumb,
	TLink,
	TLocationSearchResponse,
	TPropertyLocationDetails,
	TStreetDetails,
	TSelectedMarkersData,
	TNewDevelopmentSelectedData
} from '@shared/types/types';
import { EAccessDeviceType } from '@shared/types/enums';
import { TCompareProperty } from '@shared/types/types';
import { TGeoJSONFeature } from '@shared/interfaces/geoSpatialService';
import { TProjectRecurringInspections } from '@newDevelopment/core/types/newDevelopmentTypes';

export type TListingSrResponse = {
	success: boolean;
	data: TListingSrPageResponse;
};

export interface TLgaProfile {
	link: string;
}

export interface ISchoolInfoEsRes {
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

export type TListingSrPageResponse = {
	listings: TListing[];
	pins: TPinListing[];
	schoolInfo?: ISchoolInfoEsRes[];
	p360Properties: {
		total: number;
		data: TPinP360[];
	};
	localExpert?: TLocalExpertAgency;
	seoDescription: string;
	seoLinks?: TSeoLinks;
	suburbProfile?: TSuburbProfile;
	lgaProfile?: TLgaProfile;
	auctionResult?: string;
	breadCrumbs?: TBreadcrumb[];
	agentBanner?: TAgentBanner;
	locationESRecords?: TLocationRecord[];
	streetESRecords?: TStreetRecord[];
	appliedFilters?: {
		filters: string[];
		redirectUrl: string;
	};
	pinsTotal: number;
	filterTotal: number;
	size: number;
	rentOrSaleCount?: number;
	surroundingLocListingStartIndex?: number;
};

export type TProperties = {
	studyrooms: number;
	carparks: number;
	city?: string;
	inspections?: TListingInspections[];
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

type TListingBase = {
	adProjectId?: string;
	projectId?: string;
	developmentContactNo?: string;
	imageUrlSlug: string;
	entityType?: EListingEntityType;
	properties?: TProperties[];
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
	location: TLocationCoordinates;
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

export type TListing = TListingBase & {
	weightage: number;
	inspections: TListingInspections[];
	recurringInspections?: TProjectRecurringInspections[];
	updatedAt: Date;
	createdAt: Date;
	onMarketAt: Date;
	inspectionId?: number;
	images?: TListingImage[];
	floorPlans?: TListingFloorPlan[];
	agency?: TListingAgency;
	agents?: TListingAgent[];
	listingDetailLink: string;
	addToCalendarFileUrl?: string;
	heroImageUrl?: string;
	note?: string;
	noteId?: number;
	isReipListing?: boolean;
};

export type TListingImage = {
	url: string;
	sequence: number;
};

export type TListingFloorPlan = {
	type: string;
	fileName: string;
	sequence: number;
};

export type TListingAgency = {
	id: number;
	name: string;
	brandContrastColour?: string;
	logoFileName: string;
	brandColour: string;
	agencyProfileLink?: string;
	isReipAgency?: boolean;
};

export interface TListingAgent {
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
}

export type TP360Image = { google?: string; photo?: string; coreLogic?: string };

export type TPinP360 = {
	gnafId: string;
	avmHigh: number;
	avmLow: number;
	avmConfidenceBand: string;
	seoSlug: string;
	image: TP360Image;
	bathrooms?: number;
	bedrooms?: number;
	carSpaces?: number;
	location?: TLocationCoordinates;
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

export type TLocalExpertAgency = {
	listings: TLocalExpertListing[];
	agencyBrandColour?: string;
	agencyProfileLink: string;
	agencyLogo: string;
	agencyName: string;
	agencyBrandContrastColour: string;
	isReipAgency?: boolean;
};

export type TLocalExpertListing = {
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

export type TSeoLinks = {
	bedrooms: TLink[];
	popularSuburb: TLink[];
	popularAgencies: TLink[];
	footerSeoLinks?: TDynamicFooterLinks;
	price?: TLink[];
};

export interface TDynamicFooterLinks {
	sale?: TLink[];
	rent?: TLink[];
	neighboringSuburb?: TLink[];
	neighbouringSchools?: TLink[];
	agencySearchResult?: TLink;
	newDevelopmentSearchResult?: TLink;
}

export type TSuburbProfile = {
	link: string;
	profileImage?: string;
};

export type TAgentBanner = {
	fileName: string;
	webLink: string;
	agencyId: number;
	isReipAgency?: boolean;
};

export type TLocationRecord = {
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

export type TStreetRecord = {
	id: number;
	state: string;
	suburbName: string;
	streetName: string;
	streetAddress: string;
	postcode: string;
};

export type TPinListing = TListingBase & {
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
	agency?: TListingAgency;
	isReipListing?: boolean;
};

export type TP360ListingDetailLink = {
	success: boolean;
	data: string;
};

export type TListingSrPageViewMatomoData = {
	listingSrPageData: TListingSrPageResponse;
	urlData: IListingSrData;
	customTitle: string;
	customUrl: string;
};

export type TListingDetailByIds = {
	success: boolean;
	data: TListing[];
};

export type TListingDetails = {
	listingIds: number[];
	saleMethod: ESaleMethod;
};

export type TBoundingBox = IListingSrData & {
	topLeftLatitude?: number;
	topLeftLongitude?: number;
	bottomRightLatitude?: number;
	bottomRightLongitude?: number;
};

export type TGridDetails = TBoundingBox & {
	gridIds?: string[];
	gridLevel?: string;
};

export type TListingBySurroundedBoundariesOrGridIdsResponse = TListingSrPageResponse & {
	suburbIds: number[];
};

export type TListingGridIdsResponse = {
	data: TListingBySurroundedBoundariesOrGridIdsResponse;
	success?: boolean;
	message?: string;
};

//todo: Need to move the type to carch folder and remove the tight coupling from the revoAutoCompleteV2 component
export type TSelectedLocation = TItems<TLocationSearchResponse & TPropertyLocationDetails & TStreetDetails>;

export type TGridData = {
	bounds: string;
	boundaryJson: string;
};
export type TLargeGridData = TGridData & {
	gridId: string;
};

export type TMediumGridData = TGridData & {
	bboxMed: [number, number, number, number];
	m_gridCellPolygon: any;
	medGridId: string;
};

export type TSmallGridData = TGridData & {
	smallGridId: string;
};

export type TGridIds = {
	smallGridIds: string[];
	mediumGridIds: string[];
	largeGridIds: string[];
};

export type TItems<T> = {
	groupLabel?: EGroupLabel;
	groupId?: string;
	groupIconType: EGroupIcon;
	// other properties
	displayName: string;
	value: T;
	isSelected?: boolean;
};

export type TListingByFiltersRes = {
	data: TFilterCountDetails;
	status: number;
};

export type TFilterCountDetails = {
	success: boolean;
	data: TFilterCountInfo;
};

export type TFilterCountInfo = {
	listingCountDisplayString: string;
	total: number;
};

export type TSrMapProperty = {
	propertyId: string;
	streetAddress?: string;
	fullAddress: string;
	streetWithSuburb?: string;
	bath: number;
	bed: number;
	car: number;
	propertyType?: string[];
	primaryPropertyType?: string;
	latitude: number;
	longitude: number;
	heroImageUrl?: string;
	heading: string;
	address: TListingAddress;
	detailLink: string;
	isRecentlyViewed: boolean;
	isShortListed?: boolean;
};

export type TListingMetadata = TSrMapProperty & {
	isListing: true;

	listingMetadata: {
		id: number;
		status?: EListingStatus;
		rank: EListingRank;
		saleMethod: ESaleMethod;
		imageUrlSlug: string;
		soldAt?: string;
		inspectionStart?: string;
		inspectionEnd?: string;
		auctionAt?: string;
		inspections: TListingInspections[];
		images?: TListingImage[];
		externalImage?: string;
		floorPlans?: {
			type: string;
			fileName: string;
			sequence: number;
		}[];
		agency?: TListingAgency;
		agents?: TListingAgent[];
		updatedText: string;
		note?: string;
		noteId?: number;
	};
};

export type TListingAddress = {
	unitNumber?: string;
	isStreetHidden?: boolean;
	suburbName: string;
	postcode: string;
	streetAddress: string;
	state: string;
	streetNumber?: string;
	streetName?: string;
	city?: string;
	lgaName?: string;
};

export type TListingInspections = {
	// remove
	id: number;
	endAt: Date;
	startAt: Date;
};

export type TSrPageScreen = 'map' | 'list' | 'list-map';

export type TListingSrPropertyPreviewContext = {
	previewSelection: TSelectedMarkersData[] | [];
	setPreviewSelection: (data: TSelectedMarkersData[]) => void;
	listingDetailSelection: TSelectedMarkersData | null;
	newDevelopmentDetailSelection: TNewDevelopmentSelectedData | null;
	propertyDetailSelection: TSelectedMarkersData | null;
	setListingDetailSelection: (details: TSelectedMarkersData | null) => void;
	setNewDevelopmentDetailSelection: (details: TNewDevelopmentSelectedData | null) => void;
	setPropertyDetailSelection: (details: TSelectedMarkersData | null) => void;
};

export type TListingSrHookInitialData = {
	listingSrResponse: TListingSrPageResponse;
	appliedFilters: IListingSrData;
	deviceType: EAccessDeviceType;
	srPageUrl: string;
	selectedLocationName: string[];
	isListingSrLoading: boolean;
	ipAddress?: string;
	compareProperties: TCompareProperty[];
	toggleSeeAll: boolean;
	isFrom?: EModuleType;
	isMapSrLoading: boolean;
	isCollapseBottomSheet: boolean;
	srMapInstance: any;
	isSortChange: boolean;
	previewSelection: TListingSrPropertyPreviewContext['previewSelection'];
	listingDetailSelection: TListingSrPropertyPreviewContext['listingDetailSelection'];
	propertyDetailSelection: TListingSrPropertyPreviewContext['propertyDetailSelection'];
	newDevelopmentDetailSelection: TListingSrPropertyPreviewContext['newDevelopmentDetailSelection'];
};

export type TExtendedGeoJSONFeature = TGeoJSONFeature & {
	extraId: string;
	bBox?: number[];
};

export type TSmallGridInfo = {
	bBoxSmall: number[];
	smallGridPolygonCell: TExtendedGeoJSONFeature;
	smallGridId: string;
};

export type TRecentSearchesData = {
	displayName: string[];
	locations: ILocation[];
	filters?: IListingSrData & ISchoolCatchmentSrUrlFromData;
	pageUrl?: string;
};
