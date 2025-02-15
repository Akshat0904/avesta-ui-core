import {
	EListingEntityType,
	EListingSortTypes,
	EListingStatus,
	EPropertyTypes,
	ESaleMethod,
	ILocation
} from '@realestateview/avesta-js-core';
import { EAlertTypes, EListingRank, ELocationTypes, EModuleType, ESaveSearchFrequency, EStates } from './enums';
import { ISchoolInfoEsRes, TItems } from '@listingSr/core/types/listingSrTypes';

export type TSelectedSearch = TItems<
	TLocationSearchResponse | TPropertyLocationDetails | TStreetDetails | ISchoolInfoEsRes
>;

export type TLocationCoordinates = {
	lat: number;
	lon: number;
};

export type TLink = {
	name: string;
	url: string;
	matomoEventAction?: string;
	isReipAgency?: boolean;
};

export type TBreadcrumb = {
	displayName: string;
	urlPath?: string;
};

export type TBBox = {
	topLeftLatitude: number;
	topLeftLongitude: number;
	bottomRightLatitude: number;
	bottomRightLongitude: number;
};

export type TMapMarker<T = [any]> = {
	id: string | number;
	data?: T;
	latitude: number;
	longitude: number;
	imgBase64?: string;
	style?: any;
};

export type TUpdateTileConfig = {
	url: string;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
};

export type TMarkerSourceType =
	| 'PRICE_PINS_SOURCE'
	| 'CIRCLE_PINS_SOURCE'
	| 'PE_SOURCE'
	| 'CURRENT_MARKER_SOURCE'
	| 'COUNT_MARKER_SOURCE'
	| 'SCHOOL_SOURCE'
	| undefined;

export type TMapVectorLayerConfig = {
	url?: string;
	zIndex?: number;
	opacity?: number;
	maxZoom?: number;
	styleFunction?: any;
	name?: string;
};

export type TMarkerStyleOptions = {
	iconUrl?: string; // URL to a marker icon
	scale?: number; // Scale for the icon size
	anchor?: [number, number]; // Anchor for the icon, e.g., [0.5, 1] for center-bottom
	// Add other style properties as needed, such as color, rotation, etc.
};

export type TMarkerOptions = {
	label?: string; // Optional label for the marker
	style?: TMarkerStyleOptions; // Custom style options
};

export type TSelectedMarkersData = {
	id: string | number;
	isListing: boolean;
	coordinates?: number[];
};

export type TNewDevelopmentSelectedData = {
	url: string;
	type: 'parent' | 'child';
};

export type TMarkerData = {
	id: string | number;
	latitude: number;
	longitude: number;
	imgBase64?: string;
	style?: any;
	options?: TMarkerOptions;
	data?: TSelectedMarkersData[];
	properties?: Record<string, any>;
};

export type TRVMarkerSourceType =
	| 'PRICE_PINS_SOURCE'
	| 'CIRCLE_PINS_SOURCE'
	| 'PE_SOURCE'
	| 'CURRENT_MARKER_SOURCE'
	| undefined;
export type TRecentlyListing = {
	// isListing: true;
	id: number;
	streetAddress: string;
	priceText: string;
	bathrooms: number;
	bedrooms: number;
	carparks: number;
	suburbName: string;
	postcode: string;
	primaryPropertyType: string;
	propertyTypes: string[];
	rank: EListingRank;
	heroImageUrl: string;
	state: EStates;
	streetNumber?: string;
	unitNumber?: string;
	isStreetHidden: boolean;
	imageUrlSlug: string;
	isPriceHidden: boolean;
	rentPerWeek: number;
	priceFrom: number;
	isSoldPriceHidden: boolean;
	soldPrice: number;
	agencyId: number;
	saleMethod: ESaleMethod;
	status: EListingStatus;
	listingDetailLink: string;
	// timeStamp?: number;
	location?: { lon: number; lat: number };
};

export type TRecentlyP360Listing = {
	// isListing: false;
	gnafId: string;
	seoSlug: string;
	bathrooms: number;
	bedrooms: number;
	carSpaces: number;
	postcode: string;
	propertyType: EPropertyTypes;
	state: EStates;
	streetAddress: string;
	streetName: string;
	streetNo: string;
	suburbName: string;
	unitNo: string;
	propertyId: number;
	contractPriceText: string;
	fullAddress: string;
	image: { nearMap?: string; google?: string; photo?: string; coreLogic?: string };
	p360DetailLink: string;
	AvmEstimatedPrice: {
		Estimated: number;
		Maximum: number;
		ValuationDate: string;
		Minimum: number;
		Confidence: string;
	};
	isProperty: string;
	// timeStamp?: number;
	location?: { lon: number; lat: number };
};

export type TRecentlyViewedLocal = TRecentlyListing &
	TRecentlyP360Listing & {
		timeStamp?: number;
	};

type TGeometry = {
	type: string;
	coordinates: number[] | number[][] | number[][][];
};

export type TFeature = {
	id?: string | number;
	properties: Record<string, any>;
	geometry: TGeometry;
};

export type TFeatureProperties = {
	gridId: string;
	gridLevel: string;
	fullGridCellId: string;
	bounds: string;
	boundaryJson: string;
	isMetroCityGrid: boolean;
	layer: string;
	state?: string;
	urbanAreaName?: string;
};

export type TGeoFeature = {
	id?: string | number;
	type: 'Feature';
	geometry: {
		type: string;
		coordinates: number[] | number[][] | number[][][];
	};
	properties: {
		[key: string]: any;
	};
};
export type TCompareProperty = {
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
	land: TLandSystem;
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

export type TLandSystem = {
	landSize: number;
	landSizeSystem?: string;
};

export type TCompareConfiguresDetails = {
	title: string;
	configureName: string;
};

export type TSelectedConfigures = {
	isPropertyAddress: boolean;
	isAuctionDate: boolean;
	isInspectionDate: boolean;
	isPropertyType: boolean;
	isAccommodationDetails: boolean;
	isLandSize: boolean;
	isType: boolean;
	isPropertyImage: boolean;
};

export type TTitleSubTitle = {
	title: string;
	subTitle: string;
};

export type TOverlayParams = {
	identifier: string;
	htmlContent: string;
	position: number[];
};

export type TImageConfigurationParams = {
	property?: TImageProperties[];
	options?: {
		excludeClImg?: boolean;
		nearMapImageDimension?: {
			width?: number;
			height?: number;
		};
	};
};

export type TImageProperties = {
	gnafId?: string;
	seoSlug: string;
	fullAddress?: string;
	latitude?: number;
	longitude?: number;
	listingId?: number;
};

export type TPropertiesImage = {
	seoSlug: string;
	fullAddress?: string;
	latitude?: number;
	longitude?: number;
};

export type TPropertyImageParams = TPropertiesImage & {
	gnafId: string;
};

export type TListingImageParams = TPropertiesImage & {
	listingId: number;
};

export type TPropertiesWithImagesDetails = {
	gnafId: string;
	seoSlug: string;
	image: {
		google?: string;
		photo?: string;
		coreLogic?: string;
		nearMap?: string;
	};
	fullAddress: string;
	longitude: number;
	latitude: number;
};

export type TImagePropertyResponse = {
	success: boolean;
	data: {
		propertiesWithImages: TPropertiesWithImagesDetails[];
	};
};

export type TRecentlyViewedP360Listing = {
	gnafId: string;
	seoSlug: string;
	bathrooms: number;
	bedrooms: number;
	carSpaces: number;
	postcode: string;
	propertyType: EPropertyTypes;
	state: EStates;
	streetAddress: string;
	streetName: string;
	streetNo: string;
	suburbName: string;
	unitNo: string;
	propertyId: number;
	contractPriceText: string;
	fullAddress: string;
	image: { nearMap?: string; google?: string; photo?: string; coreLogic?: string };
	p360DetailLink: string;
	AvmEstimatedPrice: {
		Estimated: number;
		Maximum: number;
		ValuationDate: string;
		Minimum: number;
		Confidence: string;
	};
	isProperty: string;
	location?: { lon: number; lat: number };
};

export type TRecentlyViewedListing = {
	isListing: boolean;
	id: number;
	streetAddress: string;
	priceText: string;
	bathrooms: number;
	bedrooms: number;
	carparks: number;
	suburbName: string;
	postcode: string;
	primaryPropertyType: string;
	propertyTypes: string[];
	rank: EListingRank;
	heroImageUrl: string;
	state: EStates;
	streetNumber?: string;
	unitNumber?: string;
	isStreetHidden: boolean;
	imageUrlSlug: string;
	isPriceHidden: boolean;
	rentPerWeek: number;
	priceFrom: number;
	isSoldPriceHidden: boolean;
	soldPrice: number;
	agencyId: number;
	saleMethod: ESaleMethod;
	status: EListingStatus;
	listingDetailLink: string;
	location?: { lon: number; lat: number };
};

export type TRecentlyViewedProperties = TRecentlyViewedListing &
	TRecentlyViewedP360Listing & {
		timeStamp?: number;
	};

export type TSubscriberPropertyInfo = {
	success: boolean;
	data: TUserProfilePropertyInfo;
};
export type TUserProfilePropertyInfo = {
	shortListings: {
		firstName: string;
		lastName: string;
		listings: TNoteDetails[];
		seoSlugs: string[];
		friendsDetails: TFriendsDetails[];
		projects: TNoteDetails[];
	};
	followProperties: TFollowProperties[];
};

export type TNoteDetails = {
	id?: number;
	note?: string;
	projectId?: number;
	projectPropertiesId?: number;
	subscriberShortlistListingId?: number;
};

export type TFriendsDetails = {
	lastName: string;
	listings: number[];
	seoSlugs: string[];
	projects: {
		projectId?: number;
		projectPropertiesId?: number;
	}[];
	firstName: string;
};

export type TFollowProperties = {
	gnafId: string;
	trackId: number;
};

export type TAddOrRemoveShortlistPropertyBodyParams = {
	shortlistProperty?: string;
	projectId?: number | string;
	projectPropertiesId?: number | string;
};

export type TResponse = {
	message?: string;
	success: boolean;
};

export type TAddEditNoteBodyParams = {
	note: string;
	entityType?: EListingEntityType;
	projectPropertiesId?: number;
};

export type TAddEditNoteResponse = {
	success: boolean;
	response: {
		subscriberShortlistListingId: number;
	};
};

export type TDeleteNoteBodyParams = {
	subscriberListingId: number;
};

export type TFetchGroupsResponse = {
	success: boolean;
	data: TFetchGroupDetails[];
};

export type TFetchGroupDetails = {
	listingsCount: number;
	id: number;
	name: string;
	slug: string;
};

export type TCreateNewGroupName = {
	groupName: string;
};

export type TListingPropertiesForComparisonResponse = {
	success: boolean;
	data: TNewGroupDetails;
};

export type TNewGroupDetails = {
	fieldCount: number;
	affectedRows: number;
	insertId: number;
	info: string;
	serverStatus: number;
	warningStatus: number;
};

export type TComparisonListingsInfo = {
	groupId: number;
	analytics: TAnalytics;
	e_c: string;
	listings?: number[];
	properties?: string[];
	projectAndPropertyIds?: {
		projectId: number; // parent ID
		projectPropertiesId: number; // child ID
	}[];
};

export type TAnalytics = {
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

export type TSubscriberDetails = {
	listingId: number;
	email: string;
	lastName: string;
	firstName: string;
	message: string;
	phoneNumber: string;
	emailType: string;
	analytics: TAnalytics;
	EnquiryFromPage: string;
	saleMethod: string;
};

export type TSentInquiryToAgentResponse = {
	success: boolean;
	data: string;
};

export type TRecentlyViewedP360BodyParams = {
	seoSlug: string;
	timestamp: number;
};

export type TRecentlyViewedListingDetailBodyParams = {
	timestamp: number;
	listingId?: number;
	projectId?: number;
};

export type Coord = [number, number];
export type Units =
	| 'meters'
	| 'kilometers'
	| 'miles'
	| 'nauticalmiles'
	| 'degrees'
	| 'radians'
	| 'inches'
	| 'yards'
	| 'feet';

export type TLocationSearchResponse = TLocationResult & {
	displayText: string;
};
export interface TLocationResult {
	_id: string;
	locationType: string;
	state: string;
	stateFullName: string;
	city?: string;
	lgaName?: string;
	suburbName?: string;
	postcode?: string;
	locationId: number;
	lgaId?: number;
	cityId?: number;
	aliasSuburbs?: { name: string; postcode: string }[] | null;
	aliasSearchName?: string[] | null;
	title?: string;
	projectSlug?: string;
}

export type TPropertyLocationDetails = {
	title?: string;
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
	projectSlug?: string;
};

export type TStreetDetails = {
	title?: string;
	id: number;
	state: string;
	lgaId: number;
	suburbId: number;
	suburbName: string;
	streetName: string;
	streetAddress: string;
	streetNameFirst: string;
	streetAddressSlug: string;
	streetAbv: string;
	streetSlug: string;
	numberOfProperties: number;
	postcode: string;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	streetTypeCode: string;
	_id: string;
	suburbSlug: string;
	projectSlug?: string;
};

export type TListingSrLocations = {
	saleMethod: ESaleMethod[];
	features?: string[];
	carparks?: number;
	bathrooms?: number;
	page?: number;
	size?: number;
	sort?: EListingSortTypes;
	includeSurrounding?: boolean;
	excludeUnderContract?: boolean;
	locations?: ILocation[];
	priceFrom?: number;
	priceTo?: number;
	bedrooms?: number;
	propertyTypes?: EPropertyTypes[];
	topLeftLatitude?: number;
	topLeftLongitude?: number;
	bottomRightLatitude?: number;
	bottomRightLongitude?: number;
	zoom?: number;
	includeP360Properties?: boolean;
	inspectionStartAt?: string;
	auctionAt?: string;
	exactBeds?: boolean;
	exactBaths?: boolean;
	exactCars?: boolean;
};

export type IRecentlyListing = {
	// isListing: true;
	id: number;
	streetAddress: string;
	priceText: string;
	bathrooms: number;
	bedrooms: number;
	carparks: number;
	suburbName: string;
	postcode: string;
	primaryPropertyType: string;
	propertyTypes: string[];
	rank: EListingRank;
	heroImageUrl: string;
	state: EStates;
	streetNumber?: string;
	unitNumber?: string;
	isStreetHidden: boolean;
	imageUrlSlug: string;
	isPriceHidden: boolean;
	rentPerWeek: number;
	priceFrom: number;
	isSoldPriceHidden: boolean;
	soldPrice: number;
	agencyId: number;
	saleMethod: ESaleMethod;
	status: EListingStatus;
	listingDetailLink: string;
	// timeStamp?: number;
	location?: { lon: number; lat: number };
};

export type IRecentlyP360Listing = {
	// isListing: false;
	gnafId: string;
	seoSlug: string;
	bathrooms: number;
	bedrooms: number;
	carSpaces: number;
	postcode: string;
	propertyType: EPropertyTypes;
	state: EStates;
	streetAddress: string;
	streetName: string;
	streetNo: string;
	suburbName: string;
	unitNo: string;
	propertyId: number;
	contractPriceText: string;
	fullAddress: string;
	image: { nearMap?: string; google?: string; photo?: string; coreLogic?: string };
	p360DetailLink: string;
	AvmEstimatedPrice: {
		Estimated: number;
		Maximum: number;
		ValuationDate: string;
		Minimum: number;
		Confidence: string;
	};
	isProperty: string;
	// timeStamp?: number;
	location?: { lon: number; lat: number };
};

export type IRecentListingView = IRecentlyListing &
	IRecentlyP360Listing & {
		timeStamp?: number;
	};

export type TSaveSearchResponse = {
	success: boolean;
};

export type TRecentSearches = {
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

export type TRecentSearchLocations = TRecentSearches[];

export type TGovPlaningAndZonesParams = {
	suburb: string;
	streetAddress: string;
	postCode: string | number;
};

export type TGetGovPlaningAndZones = {
	lga?: string;
	has_flood_overlay: boolean;
	has_bushfire_overlay: boolean;
	has_infrastructure_overlay: boolean;
	has_environment_overlay: boolean;
	has_heritage_overlay: boolean;
	has_industry_overlay: boolean;
	zoning?: TZoning;
	zonings?: TZoning[];
};

export type TGovPlaningAndZonesResponse = {
	success: boolean;
	data: TGetGovPlaningAndZones;
};

type TZoning = {
	code: string;
	label: string;
};

export type TAreaStatistics = {
	Occupation: {
		Labels: string[];
	};
	AgeGroup: {
		Labels: string[];
		Values: number[];
	};
	Households: any;
	Occupancy: any;
};

export type TGraphLabel = {
	Labels: string[];
	SortLabels: string[];
};

export type TGraphValues = {
	Values: number[];
};

export interface ISuburbValues extends TGraphLabel {
	SuburbValues: TGraphValues;
}

export type TPocketInsights = {
	AreaStatistics: TAreaStatistics;
	Wages: ISuburbValues;
	MortgageRepayments: ISuburbValues;
	Subtitle: string;
};

type TSa1Boundary = {
	GMapRequestUrl?: string;
	Boundary?: TBoundary[];
};

type TBoundary = {
	Lat: number;
	Lng: number;
};

export type TSuburbTrendsResponse = {
	LocalityPid: number;
	Sa1TruncatedId: string;
	Address: {
		StreetAddress: string;
		Suburb: string;
	};
	PocketInsights: TPocketInsights;
	SuburbTrends: TSuburbTrends;
	Sa1Boundary?: TSa1Boundary;
	IsBot: boolean;
};

export type TSuburbTrends = {
	Title?: string;
	LocalityTrendsHouse: TLocalityTrendsHouse;
	LocalityTrendsUnit: TLocalityTrendsUnit;
};

type TLocalityTrendsHouse = {
	LatestMedianPrice: string;
	LatestAverageDaysOnMarket: string;
	LatestMedianSaleDiscount: string;
	LatestMedianLease: string;
	MedianSalePrice: TPrice;
	MedianRentalPrice: TPrice;
	AverageDaysonMarket: TPrice;
	AverageVendorDiscount: TPrice;
};

type TLocalityTrendsUnit = {
	LatestMedianPrice: string;
	LatestAverageDaysOnMarket: string;
	LatestMedianSaleDiscount: string;
	LatestMedianLease: string;
	MedianSalePrice: TPrice;
	MedianRentalPrice: TPrice;
	AverageDaysonMarket: TPrice;
	AverageVendorDiscount: TPrice;
};

type TPrice = {
	Labels: string[];
	Series: number[];
	SortLabels: string[];
};

export type TNearbySchoolsRevRes = {
	primary?: TSchoolESRes[];
	secondary?: TSchoolESRes[];
	TAFE?: TSchoolESRes[];
	university?: TSchoolESRes[];
};

export type TSchoolESRes = {
	full_name: string;
	school_level?: string;
	type: string;
	rev_organisation_name: string;
	religion?: string;
	gender?: string;
	link: string;
	distanceInKm?: string;
	suburb: string;
	postcode: string;
	state: string;
	location: {
		lat: number;
		lon: number;
	};
};

export type TClCopyRightAuData = {
	category: string;
	key: string;
	content: string;
};

export type TClDisclaimers = {
	clCopyright_au?: TClCopyRightAuData;
	clData_anz?: TClCopyRightAuData;
	abs_au?: TClCopyRightAuData;
	avm_anz?: TClCopyRightAuData;
	state_au?: TClCopyRightAuData;
};

export type TAreaLivabilityScore = {
	mbCode21: string;
	suburbId: string | null;
	averageIndex: number;
	suburbName: string;
	categories: {
		index: number;
		score: number;
		categoryName: string;
		mainCategoryId: number;
	}[];
};

export type StateManagementType = 'redux' | 'context';
