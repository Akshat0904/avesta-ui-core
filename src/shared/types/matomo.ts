import { EPropertyTypes } from '@realestateview/avesta-js-core';
import { EListingPageType, EListingRank } from './enums';

export type TMatomoRequestDimensions = {
	listingId_GnafId?: string;
	listingType?: EListingPageType[];
	tierType?: EListingRank;
	agencyId?: number;
	agentId?: number;
	state?: string;
	city?: string;
	lgaName?: string;
	suburb?: string;
	bedroom?: number | string;
	bathroom?: number | string;
	carpark?: number | string;
	propertyType?: EPropertyTypes[] | string;
	sa1Code?: string;
	imageSource?: string;
	dateTime?: number;
	postCode?: string;
	name?: string;
	phone?: string;
	email?: string;
	message?: string;
	checkBoxes?: string[];
	propertyTypeMul?: string[];
	searchKeyword?: string;
	lowerPrice?: number | string;
	upperPrice?: number | string;
	includeSurrSuburb?: boolean;
	domainName?: string;
	isOwner?: number;
	suburbMul?: string[];
	category?: string;
	author?: string;
	gender?: string;
	dob?: string;
	bestDescribes?: string;
	userAction?: string;
	emailFrequency?: string;
	section?: string;
	pageNo?: number;
	sortBy?: string;
	pageName?: string;
	articleId?: string;
	bizCategory?: string;
	bizSubCategory?: string;
	searchWithin?: string;
	minLandArea?: string;
	maxLandArea?: string;
	bedroomRange?: string;
	bathroomRange?: string;
	carparkRange?: string;
	street?: string;
	features?: string[] | string;
	listingTypeMul?: string[];
	schoolName?: string;
	landSize?: number;
	isReipAgency?: boolean;
	isReipListing?: boolean;
	acid?: string | null;
};

export enum EAnalyticsEventCategory {
	NewDevelopments = 'NewDevelopments',
	Listings = 'Listings',
	P360 = 'P360',
	LocationProfile = 'LocationProfile',
	SchoolCatchment = 'SchoolCatchment',
	Agent = 'Agent'
}

export enum EAnalyticsEventAction {
	WatchVideo = 'WatchVideo',
	ViewFloorPlan = 'ViewFloorPlan',
	ViewRequestFloorplan = 'ViewRequestFloorplan',
	ViewVideo = 'ViewVideo',
	PhotoCarousel = 'PhotoCarousel',
	ViewTrends = 'ViewTrends',
	ViewDemography = 'ViewDemography',
	ViewEducation = 'ViewEducation',
	ViewPhotoGallery = 'ViewPhotoGallery',
	ViewDownloadBrochure = 'ViewDownloadBrochure',
	ViewEnquireNow = 'ViewEnquireNow',
	CallUs = 'CallUs',
	ViewRequestPrivateAppointment = 'ViewRequestPrivateAppointment',
	ViewGovernmentPlanning = 'ViewGovernmentPlanning',
	ViewStateFeatureInvestment = 'ViewStateFeatureInvestment',
	ViewBedroomBestInvestment = 'ViewBedroomBestInvestment',
	Search = 'Search',
	AddNote = 'AddNote',
	SelectCompare = 'SelectCompare',
	ViewGalleryEmailAgent = 'ViewGalleryEmailAgent',
	ViewEmailAgent = 'ViewEmailAgent',
	UnshortlistProperty = 'UnshortlistProperty',
	ShortlistProperty = 'ShortlistProperty',
	SaveNote = 'SaveNote',
	DeleteNote = 'DeleteNote',
	ViewCompare = 'ViewCompare',
	SaveCompare = 'SaveCompare',
	Share = 'Share',
	SaveInspectionTime = 'SaveInspectionTime',
	InSearchResult = 'InSearchResult',
	ViewAgentProfile = 'ViewAgentProfile',
	ViewAgencyProfile = 'ViewAgencyProfile',
	ViewSchoolCard = 'ViewSchoolCard',
	ViewListingCard = 'ViewListingCard',
	ViewNewDevelopmentCard = 'ViewNewDevelopmentCard',
	RepaymentCalculator = 'RepaymentCalculatorInteraction',
	ClickBreadcrumb = 'ClickBreadcrumb',
	ClickSubscribeToday = 'ClickSubscribeToday',
	ClickSearchAddress = 'ClickSearchAddress',
	ClickAgentPropertyAppraisal = 'ClickAgentPropertyAppraisal',
	ViewAgencyPhone = 'ViewAgencyPhone',
	ViewEmailUs = 'ViewEmailUs',
	ClickEmailUs = 'ClickEmailUs',
	ClickContactAgent = 'ClickContactAgent',
	WatchAgencyVideo = 'WatchAgencyVideo',
	ClickSponsoredAgencyEnquiry = 'ClickSponsoredAgencyEnquiry',
	FilterProperties = 'FilterProperties',
	DisplaySponsoredAgencies = 'DisplaySponsoredAgencies',
	SubmitAgentPropertyAppraisal = 'SubmitAgentPropertyAppraisal',
	CallAgent = 'CallAgent',
	InAgentSearchResult = 'InAgentSearchResult',
	ClickAgentEnquiry = 'ClickAgentEnquiry',
	ViewEnquire = 'ViewEnquire',
	ClickEnquire = 'ClickEnquire'
}

export type TDefaultMatomoParams = {
	idsite: string;
	rec: string;
	url?: string;
	_id: string;
	rand: string;
	apiv: string;
	urlref: string;
	res: string;
	h: string;
	m: string;
	s: string;
	cookie: string;
	uid?: string;
	pv_id: string;
	send_image: string;
};

export type TMatomoDimensions = Omit<
	TMatomoRequestDimensions,
	'listingType' | 'propertyTypeMul' | 'tierType' | 'listingTypeMul' | 'suburbMul'
> & {
	listingType?: EListingPageType | EListingPageType[];
	tierType?: string;
	propertyTypeMul?: string | string[];
};

export enum EAnalyticsEventType {
	OutLink = 'OutLink',
	InSearchResult = 'InSearchResult',
	LocationProfile = 'LocationProfile',
	AgentBanner = 'AgentBanner',
	LocalExpert = 'LocalExpert',
	LocalExpertListing = 'LocalExpertListing',
	Share = 'Share',
	ClickDrawer = 'ClickDrawer',
	BackToMapButton = 'BackToMapButton',
	SeoLink = 'SeoLink',
	ViewMap = 'ViewMap',
	SeeAll = 'SeeAll',
	FilterSearch = 'FilterSearch',
	BreadCrumb = 'Breadcrumb',
	SaveSearch = 'SaveSearch',
	ViewListing = 'ViewListing',
	ViewProperty = 'ViewProperty',
	SwitchMapLayer = 'SwitchMapLayer',
	AddNote = 'AddNote',
	SaveOrDeleteNote = 'SaveOrDeleteNote',
	ViewOrSaveCompare = 'ViewOrSaveCompare',
	SelectCompare = 'SelectCompare',
	PhotocarouselOrGallery = 'PhotocarouselOrGallery',
	EmailAgent = 'EmailAgent',
	ShortListOrUnShortList = 'ShortListOrUnShortList',
	ClusterMarkerClick = 'ClusterMarkerClick',
	MapPanOff = 'MapPanOff',
	NdViewSuburb = 'NdViewSuburb',
	NdSearch = 'NdSearch',
	NdViewEnquireNow = 'NdViewEnquireNow',
	NdShortlistProperty = 'NdShortlistProperty',
	NdUnshortlistProperty = 'NdUnshortlistProperty',
	NdClickBreadcrumb = 'NdClickBreadcrumb',
	NdSelectCompare = 'NdSelectCompare',
	NdShare = 'NdShare',
	NdViewTrendsAndEducation = 'NdViewTrendsAndEducation',
	NdCommonAction = 'NdCommonAction',
	NdViewStateFeatureInvestment = 'NdViewStateFeatureInvestment',
	NdViewBedroomBestInvestment = 'NdViewBedroomBestInvestment',
	NdFilterSearch = 'NdFilterSearch',
	NdSaveInspectionTime = 'NdSaveInspectionTime',
	SchoolCardClick = 'SchoolCardClick',
	AgentAgencyProfile = 'AgentAgencyProfile',
	RepaymentCalculator = 'RepaymentCalculator',
	AgentSearch = 'AgentSearch',
	AgencySrListing = 'AgencySrListing',
	AgentSrListing = 'AgentSrListing',
	AgencyDetailListing = 'AgencyDetailListing',
	ClickSubscribeToday = 'ClickSubscribeToday',
	ClickSearchAddress = 'ClickSearchAddress',
	ClickAgentPropertyAppraisal = 'ClickAgentPropertyAppraisal',
	ViewAgencyPhone = 'ViewAgencyPhone',
	ViewEmailUs = 'ViewEmailUs',
	ClickEmailUs = 'ClickEmailUs',
	ClickContactAgent = 'ClickContactAgent',
	WatchAgencyVideo = 'WatchAgencyVideo',
	ClickSponsoredAgencyEnquiry = 'ClickSponsoredAgencyEnquiry',
	FilterProperties = 'FilterProperties',
	DisplaySponsoredAgencies = 'DisplaySponsoredAgencies',
	SubmitAgentPropertyAppraisal = 'SubmitAgentPropertyAppraisal',
	CallAgent = 'CallAgent',
	ClickAgentEnquiry = 'ClickAgentEnquiry',
	ViewEnquire = 'ViewEnquire',
	ClickEnquire = 'ClickEnquire'
}
export enum EAnalyticsTitleType {
	ListingSrListMapPage = 'Search Listings - List-Map page',
	ListingSrMapPage = 'Search Listings - Map page',
	ListingSrListPage = 'Search Listings - List page',
	ListingDetailPage = 'Listings Page',
	NewDevParentDetailPage = 'New Developments page',
	NewDevChildDetailPage = 'New Developments Child Detail page',
	NewDevHomePage = 'New Developments Home Page',
	NewDevSrMapPage = 'Search New Developments - Map page',
	NewDevSrListPage = 'Search New Developments - List page',
	NewDevSrListMapPage = 'Search New Developments - List-Map page',
	SchoolCatchmentHomePage = 'School Catchment Home Page',
	SchoolCatchmentSrListMapPage = 'Search Schools - List-Map page',
	SchoolCatchmentSrMapPage = 'Search Schools - Map page',
	SchoolCatchmentSrListPage = 'Search Schools - List page',
	AgentSearchPage = 'Agent Search Page',
	AgencyPage = 'Agency Page',
	AgentPage = 'Agent Page',
	SearchAgencyPage = 'Search Agency',
	SearchAgentPage = 'Search Agent'
}

type TLocationDimensions = Pick<TMatomoRequestDimensions, 'state' | 'city' | 'lgaName' | 'suburb' | 'postCode'>;

type TStreetDimensions = Pick<TMatomoRequestDimensions, 'street'> & TLocationDimensions;

type TAccommodationDimensions = Pick<TMatomoRequestDimensions, 'bedroom' | 'bathroom' | 'carpark' | 'propertyType'>;

export type TListingSrPageCommonDimensions = Pick<
	TMatomoRequestDimensions,
	| 'listingType'
	| 'lowerPrice'
	| 'upperPrice'
	| 'includeSurrSuburb'
	| 'pageNo'
	| 'sortBy'
	| 'features'
	| 'suburbMul'
	| 'acid'
> &
	TStreetDimensions &
	TAccommodationDimensions;

export type TListingCommonDimensions = Pick<
	TMatomoRequestDimensions,
	| 'listingId_GnafId'
	| 'listingType'
	| 'tierType'
	| 'agencyId'
	| 'agentId'
	| 'imageSource'
	| 'sa1Code'
	| 'landSize'
	| 'isReipAgency'
	| 'isReipListing'
> &
	TAccommodationDimensions &
	TStreetDimensions;

type TAgentBannerDimensions = Pick<TMatomoRequestDimensions, 'agencyId' | 'domainName'> & TLocationDimensions;

type TLocalExpertDimensions = Pick<TMatomoRequestDimensions, 'agencyId' | 'isReipAgency' | 'isReipListing'> &
	TLocationDimensions;

export type TSeoLinksDimensions = Pick<
	TMatomoRequestDimensions,
	| 'agencyId'
	| 'bedroom'
	| 'suburb'
	| 'postCode'
	| 'listingType'
	| 'propertyType'
	| 'lowerPrice'
	| 'upperPrice'
	| 'lgaName'
	| 'isReipAgency'
>;

export type TMapPanOffDimensions = Pick<
	TMatomoRequestDimensions,
	| 'listingType'
	| 'propertyType'
	| 'propertyTypeMul'
	| 'lowerPrice'
	| 'upperPrice'
	| 'includeSurrSuburb'
	| 'features'
	| 'listingTypeMul'
	| 'postCode'
> &
	TAccommodationDimensions;

type TViewMapDimensions = Pick<TMatomoRequestDimensions, 'listingType'> & TAccommodationDimensions & TStreetDimensions;

type TFilterSearchDimensions = Pick<TMatomoRequestDimensions, 'listingId_GnafId' | 'searchKeyword'> &
	TListingSrPageCommonDimensions;

type TBreadCrumbDimensions = Pick<TMatomoRequestDimensions, 'listingType' | 'schoolName'> &
	TStreetDimensions &
	TAccommodationDimensions;

type TSaveSearchDimensions = Pick<TMatomoRequestDimensions, 'emailFrequency'> & TListingSrPageCommonDimensions;

type TViewPropertyDimensions = Pick<TMatomoRequestDimensions, 'listingId_GnafId' | 'sa1Code' | 'imageSource'> &
	TStreetDimensions &
	TAccommodationDimensions;

type TSaveOrDeleteNoteDimensions = Pick<TMatomoRequestDimensions, 'message'>;

type TOutLinkDimensions = Pick<TMatomoRequestDimensions, 'domainName'>;

type TNdViewSuburbDimensions = Pick<TMatomoRequestDimensions, 'suburb' | 'state' | 'postCode'>;

type TNdSearchDimensions = Pick<
	TMatomoRequestDimensions,
	'listingId_GnafId' | 'searchKeyword' | 'lowerPrice' | 'upperPrice' | 'includeSurrSuburb'
> &
	TLocationDimensions &
	TNdAccommodationDimensions;

export type TNdAccommodationDimensions = Pick<
	TMatomoRequestDimensions,
	'bedroomRange' | 'bathroomRange' | 'carparkRange' | 'propertyType' | 'bedroom' | 'bathroom' | 'carpark'
>;

type TNdCommonDimensions = Pick<TMatomoRequestDimensions, 'listingId_GnafId' | 'schoolName'> &
	TLocationDimensions &
	TNdAccommodationDimensions;

type TNdFeatureInvestmentDimensions = Pick<TMatomoRequestDimensions, 'state'>;
type TNdBestInvestmentDimensions = Pick<TMatomoRequestDimensions, 'bedroom'>;

type TNdFilterSearchDimensions = Pick<
	TMatomoRequestDimensions,
	'searchKeyword' | 'lowerPrice' | 'upperPrice' | 'includeSurrSuburb' | 'street'
> &
	TNdCommonDimensions;

export type TNDSrPageCommonDimensions = Pick<
	TMatomoRequestDimensions,
	| 'lowerPrice'
	| 'upperPrice'
	| 'includeSurrSuburb'
	| 'pageNo'
	| 'sortBy'
	| 'suburbMul'
	| 'minLandArea'
	| 'maxLandArea'
	| 'schoolName'
> &
	TStreetDimensions &
	TNdAccommodationDimensions;

export type TNdListingCommonDimensions = Pick<TMatomoRequestDimensions, 'listingId_GnafId' | 'landSize'> &
	TNdAccommodationDimensions &
	TStreetDimensions;

export type TListingsCommonDimensions = TListingCommonDimensions & TNdAccommodationDimensions;

type TNdSaveInspectionTimeDimensions = Pick<TMatomoRequestDimensions, 'dateTime'> & TNdCommonDimensions;

type TViewSchoolCardDimensions = Pick<TMatomoRequestDimensions, 'schoolName'> & TLocationDimensions;

export enum EAccommodationType {
	Range = 'Range',
	Simple = 'Simple'
}

export type TAgentSearchSelectionDimensions = Pick<
	TMatomoRequestDimensions,
	| 'agentId'
	| 'agencyId'
	| 'state'
	| 'lgaName'
	| 'suburb'
	| 'postCode'
	| 'searchKeyword'
	| 'propertyType'
	| 'isReipAgency'
	| 'propertyTypeMul'
	| 'sortBy'
>;

export type TAgentAgencyPropertyListingsDimensions = Pick<
	TMatomoRequestDimensions,
	| 'agencyId'
	| 'agentId'
	| 'bathroom'
	| 'bedroom'
	| 'carpark'
	| 'city'
	| 'isReipAgency'
	| 'isReipListing'
	| 'lgaName'
	| 'listingId_GnafId'
	| 'listingType'
	| 'postCode'
	| 'propertyType'
	| 'propertyTypeMul'
	| 'state'
	| 'street'
	| 'suburb'
	| 'tierType'
>;

export type TAgencyPageDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'isReipAgency' | 'isReipListing' | 'listingType' | 'pageNo' | 'postCode' | 'state' | 'suburb'
>;

export type TAgentPageDimensions = Pick<
	TMatomoRequestDimensions,
	'listingType' | 'agencyId' | 'agentId' | 'suburb' | 'pageNo' | 'postCode' | 'isReipAgency'
>;

export type TClickSubscribeTodayDimensions = Pick<
	TMatomoRequestDimensions,
	'state' | 'city' | 'lgaName' | 'suburb' | 'postCode'
>;

export type TClickSearchAddressDimensions = Pick<
	TMatomoRequestDimensions,
	'state' | 'city' | 'lgaName' | 'suburb' | 'postCode'
>;

export type TFreeAppraisalDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'agentId' | 'state' | 'city' | 'lgaName' | 'suburb' | 'postCode'
>;

export type TClickContactAgentDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'agentId' | 'name' | 'phone' | 'email' | 'message' | 'checkBoxes'
>;

export type TClickAgencyPhoneAndEmailDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'isReipAgency' | 'isReipListing'
>;

export type TClickEmailUsDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'name' | 'phone' | 'email' | 'message' | 'checkBoxes'
>;

export type TFilterPropertiesDimensions = Pick<
	TMatomoRequestDimensions,
	'propertyType' | 'bedroom' | 'agencyId' | 'agentId' | 'isReipAgency'
>;

export type TAgencySrListingDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'agentId' | 'state' | 'lgaName' | 'suburb' | 'postCode' | 'isReipAgency' | 'isReipListing'
>;

export type TAgentSrListingDimensions = Pick<
	TMatomoRequestDimensions,
	'agentId' | 'state' | 'lgaName' | 'suburb' | 'postCode'
>;
export type TClickSponsoredAgencyEnquiryDimensions = Pick<
	TMatomoRequestDimensions,
	| 'agencyId'
	| 'state'
	| 'city'
	| 'lgaName'
	| 'suburb'
	| 'postCode'
	| 'name'
	| 'phone'
	| 'email'
	| 'message'
	| 'checkBoxes'
	| 'isReipAgency'
>;

export type TWatchAgencyVideoDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'state' | 'city' | 'lgaName' | 'suburb' | 'postCode' | 'isReipAgency'
>;

export type TDisplaySponsoredAgenciesDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'state' | 'city' | 'lgaName' | 'suburb' | 'postCode' | 'isReipAgency'
>;

export type TSubmitFreeAppraisalDimensions = Pick<
	TMatomoRequestDimensions,
	'listingId_GnafId' | 'agencyId' | 'agentId' | 'name' | 'phone' | 'email' | 'isOwner' | 'isReipAgency'
>;

export type TAgentEnquiryDimensions = Pick<TMatomoRequestDimensions, 'agentId'>;

export type TAgencyEnquiryClickDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'isReipAgency' | 'isReipListing'
>;

export type TAgencyEnquirySubmitDimensions = Pick<
	TMatomoRequestDimensions,
	'agencyId' | 'name' | 'phone' | 'email' | 'message' | 'checkBoxes' | 'isReipAgency' | 'isReipListing'
>;

export type TCallAgentDimensions = Pick<
	TMatomoRequestDimensions,
	| 'agentId'
	| 'agencyId'
	| 'listingId_GnafId'
	| 'listingTypeMul'
	| 'tierType'
	| 'state'
	| 'city'
	| 'lgaName'
	| 'suburb'
	| 'bedroom'
	| 'bathroom'
	| 'carpark'
	| 'propertyType'
	| 'postCode'
>;

export type TAgentSearchPageDimensions = Pick<
	TMatomoRequestDimensions,
	'state' | 'lgaName' | 'suburb' | 'postCode' | 'suburbMul' | 'pageNo' | 'sortBy' | 'propertyType'
>;

export type TAgencySearchPageDimensions = Pick<
	TMatomoRequestDimensions,
	'state' | 'lgaName' | 'suburb' | 'postCode' | 'suburbMul' | 'pageNo' | 'sortBy' | 'propertyType'
>;

export type TTrackEventMap = {
	[EAnalyticsEventType.OutLink]: TOutLinkDimensions;
	[EAnalyticsEventType.InSearchResult]: TListingsCommonDimensions;
	[EAnalyticsEventType.LocationProfile]: TLocationDimensions;
	[EAnalyticsEventType.AgentBanner]: TAgentBannerDimensions;
	[EAnalyticsEventType.LocalExpert]: TLocalExpertDimensions;
	[EAnalyticsEventType.LocalExpertListing]: TListingCommonDimensions;
	[EAnalyticsEventType.Share]: TListingCommonDimensions;
	[EAnalyticsEventType.ClickDrawer]: TListingSrPageCommonDimensions;
	[EAnalyticsEventType.SeeAll]: TListingSrPageCommonDimensions;
	[EAnalyticsEventType.BackToMapButton]: TListingSrPageCommonDimensions;
	[EAnalyticsEventType.SeoLink]: TSeoLinksDimensions;
	[EAnalyticsEventType.ViewMap]: TViewMapDimensions;
	[EAnalyticsEventType.FilterSearch]: TFilterSearchDimensions;
	[EAnalyticsEventType.BreadCrumb]: TBreadCrumbDimensions;
	[EAnalyticsEventType.SaveSearch]: TSaveSearchDimensions;
	[EAnalyticsEventType.ViewListing]: TListingCommonDimensions;
	[EAnalyticsEventType.ViewProperty]: TViewPropertyDimensions;
	[EAnalyticsEventType.SwitchMapLayer]: null;
	[EAnalyticsEventType.AddNote]: null;
	[EAnalyticsEventType.SaveOrDeleteNote]: TSaveOrDeleteNoteDimensions;
	[EAnalyticsEventType.ViewOrSaveCompare]: null;
	[EAnalyticsEventType.SelectCompare]: TListingCommonDimensions;
	[EAnalyticsEventType.PhotocarouselOrGallery]: TListingCommonDimensions;
	[EAnalyticsEventType.EmailAgent]: TListingCommonDimensions;
	[EAnalyticsEventType.ShortListOrUnShortList]: TListingCommonDimensions;
	[EAnalyticsEventType.ClusterMarkerClick]: TListingSrPageCommonDimensions;
	[EAnalyticsEventType.MapPanOff]: TMapPanOffDimensions;
	[EAnalyticsEventType.NdViewSuburb]: TNdViewSuburbDimensions;
	[EAnalyticsEventType.NdSearch]: TNdSearchDimensions;
	[EAnalyticsEventType.NdViewEnquireNow]: TNdCommonDimensions;
	[EAnalyticsEventType.NdSelectCompare]: TNdCommonDimensions;
	[EAnalyticsEventType.NdShare]: TNdCommonDimensions;
	[EAnalyticsEventType.NdViewTrendsAndEducation]: TNdCommonDimensions;
	[EAnalyticsEventType.NdShortlistProperty]: TNdCommonDimensions;
	[EAnalyticsEventType.NdUnshortlistProperty]: TNdCommonDimensions;
	[EAnalyticsEventType.NdClickBreadcrumb]: TNdCommonDimensions;
	[EAnalyticsEventType.NdCommonAction]: TNdCommonDimensions;
	[EAnalyticsEventType.NdViewStateFeatureInvestment]: TNdFeatureInvestmentDimensions;
	[EAnalyticsEventType.NdViewBedroomBestInvestment]: TNdBestInvestmentDimensions;
	[EAnalyticsEventType.NdFilterSearch]: TNdFilterSearchDimensions;
	[EAnalyticsEventType.NdSaveInspectionTime]: TNdSaveInspectionTimeDimensions;
	[EAnalyticsEventType.SchoolCardClick]: TViewSchoolCardDimensions;
	[EAnalyticsEventType.AgentAgencyProfile]: TListingCommonDimensions;
	[EAnalyticsEventType.RepaymentCalculator]: any;
	[EAnalyticsEventType.AgentSearch]: TAgentSearchSelectionDimensions;
	[EAnalyticsEventType.AgencySrListing]: TAgencySrListingDimensions;
	[EAnalyticsEventType.AgentSrListing]: TAgentSrListingDimensions;
	[EAnalyticsEventType.AgencyDetailListing]: TAgentAgencyPropertyListingsDimensions;
	[EAnalyticsEventType.ClickSubscribeToday]: TClickSubscribeTodayDimensions;
	[EAnalyticsEventType.ClickSearchAddress]: TClickSearchAddressDimensions;
	[EAnalyticsEventType.ClickAgentPropertyAppraisal]: TFreeAppraisalDimensions;
	[EAnalyticsEventType.ViewAgencyPhone]: TClickAgencyPhoneAndEmailDimensions;
	[EAnalyticsEventType.ViewEmailUs]: TClickAgencyPhoneAndEmailDimensions;
	[EAnalyticsEventType.WatchAgencyVideo]: TWatchAgencyVideoDimensions;
	[EAnalyticsEventType.FilterProperties]: TFilterPropertiesDimensions;
	[EAnalyticsEventType.ClickEmailUs]: TClickEmailUsDimensions;
	[EAnalyticsEventType.ClickContactAgent]: TClickContactAgentDimensions;
	[EAnalyticsEventType.ClickSponsoredAgencyEnquiry]: TClickSponsoredAgencyEnquiryDimensions;
	[EAnalyticsEventType.DisplaySponsoredAgencies]: TDisplaySponsoredAgenciesDimensions;
	[EAnalyticsEventType.SubmitAgentPropertyAppraisal]: TSubmitFreeAppraisalDimensions;
	[EAnalyticsEventType.CallAgent]: TCallAgentDimensions;
	[EAnalyticsEventType.ClickAgentEnquiry]: TAgentEnquiryDimensions;
	[EAnalyticsEventType.ViewEnquire]: TAgencyEnquiryClickDimensions;
	[EAnalyticsEventType.ClickEnquire]: TAgencyEnquirySubmitDimensions;
};

export type TTrackPageViewMap = {
	[EAnalyticsTitleType.ListingSrListMapPage]: TListingSrPageCommonDimensions;
	[EAnalyticsTitleType.ListingSrMapPage]: TListingSrPageCommonDimensions;
	[EAnalyticsTitleType.ListingSrListPage]: TListingSrPageCommonDimensions;
	[EAnalyticsTitleType.ListingDetailPage]: TListingCommonDimensions;
	[EAnalyticsTitleType.NewDevParentDetailPage]: TNdCommonDimensions;
	[EAnalyticsTitleType.NewDevChildDetailPage]: TNdCommonDimensions;
	[EAnalyticsTitleType.NewDevHomePage]: null;
	[EAnalyticsTitleType.NewDevSrListMapPage]: TNDSrPageCommonDimensions;
	[EAnalyticsTitleType.NewDevSrMapPage]: TNDSrPageCommonDimensions;
	[EAnalyticsTitleType.NewDevSrListPage]: TNDSrPageCommonDimensions;
	[EAnalyticsTitleType.SchoolCatchmentHomePage]: null;
	[EAnalyticsTitleType.SchoolCatchmentSrListMapPage]: TNDSrPageCommonDimensions;
	[EAnalyticsTitleType.SchoolCatchmentSrMapPage]: TNDSrPageCommonDimensions;
	[EAnalyticsTitleType.SchoolCatchmentSrListPage]: TNDSrPageCommonDimensions;
	[EAnalyticsTitleType.AgentSearchPage]: null;
	[EAnalyticsTitleType.AgencyPage]: TAgencyPageDimensions;
	[EAnalyticsTitleType.AgentPage]: TAgentPageDimensions;
	[EAnalyticsTitleType.SearchAgentPage]: TAgentSearchPageDimensions;
	[EAnalyticsTitleType.SearchAgencyPage]: TAgencySearchPageDimensions;
};
