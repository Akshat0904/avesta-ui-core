export enum ELAScreen {
	BuyHomePage = 'buy-home-page',
	RentHomePage = 'rent-home-page',
	SoldHomePage = 'sold-home-page'
}

export enum ENotificationTypes {
	error = 'error',
	success = 'success',
	info = 'info'
}

export enum EAccessDeviceType {
	MobileAppIOS = 'mobile-app-iOS',
	MobileAppAndroid = 'mobile-app-android',
	MobileWeb = 'mobile-web',
	Desktop = 'desktop'
}

export enum EListingRank {
	Standard = 'Standard',
	Basic = 'Basic',
	Premium = 'Premium',
	Feature = 'Feature'
}

export enum ELocationTypes {
	suburb = 'suburb',
	lgaName = 'lgaName',
	city = 'city',
	state = 'state',
	street = 'street'
}

export enum ECookies {
	uiNotificationCookie = 'uiNotificationCookie',
	ZEUSTOKEN = 'ZEUSTOKEN',
	BRAAVOSTOKEN = 'BRAAVOSTOKEN'
}

export enum EToastMsg {
	listingNotFound = 'Listing not found!',
	dataNotFound = 'No Data Found!',
	pageNotFound = 'Page not found!',
	somethingWrong = 'Something went wrong!',
	agencyNotFound = 'Agency not found!',
	somethingWrongTryLater = 'Something went wrong, Try again later!',
	addFavourite = 'The listing has been added to your shortlist.',
	removeFavourite = 'Listing has been removed from your shortlist.',
	accountDetailsUpdated = 'Account successfully updated',
	propertyRemoved = 'Property removed successfully',
	formSubmitted = 'Form submitted successfully',
	updatedSuccessfully = 'Saved successfully',
	locationsErrorMessage = 'Please select the locations',
	notLoggedInMessage = 'Your login session has expired. Please login again to continue.',
	deleteAccount = 'Your Account deleted successfully',
	redeemOffer = 'Thank you, we will be touching',
	successfullyCopiesLink = 'Successfully copied the link!',
	failedToCopyLink = 'Failed to copy link. Please try again.',
	agentEnquirySent = 'Enquiry sent successfully',
	enquirySent = 'Enquiry sent successfully!',
	groupCreated = 'group created successfully',
	referralConveyancingSent = 'Thank you for referral, we will be touching',
	propertyReviewAddedSuccessfully = 'Property review requested successfully!',
	groupDeleted = 'Group deleted successfully!',
	propertyDeleted = 'Property deleted successfully!',
	friendDdeleted = 'Friend deleted successfully',
	comparisonSaved = 'Comparison saved successfully',
	invited = 'Invited Successfully',
	friendRequestAccepted = 'Friend request has been accepted successfully!',
	friendRequestDeclined = 'Friend request has been declined successfully!',
	duplicateFriendRequest = 'Duplicate Entry!',
	noteAddedSuccessfully = 'Note Saved Successfully!',
	noteUpdatedSuccessfully = 'Note Updated Successfully!',
	noteDeletedSuccessfully = 'Note Deleted Successfully!',
	recentlyViewedPropertyDelete = ' Recently viewed property delete successfully!',
	notMore10Properties = 'You cannot add more than 10 properties',
	groupUpdated = 'group updated successfully',
	unFollow = 'You have successfully unfollowed this property',
	myProfileLocationRequired = 'Location must be required!!!',
	articleNotFound = 'Article not found!',
	authorNotFound = 'Author not found',
	moreThan15Properties = 'Follow allows you to track your top 15 properties. To follow another property, please update your preferences.',
	moreThan15Streets = 'Follow allows you to track your top 15 streets. To follow another street, please update your preferences.',
	moreThan15Suburbs = 'Follow allows you to track your top 15 suburbs. To follow another suburb, please update your preferences.',
	appraisalInquirySuccess = 'Appraisal Inquiry Successfully Submitted',
	appraisalInquiryFailed = 'Appraisal Inquiry Failed'
}

export enum EListingPageType {
	buy = 'BUY',
	rent = 'RENT',
	sold = 'SOLD',
	auction = 'AUCTION'
}

export enum EFitMapToMarkers {
	SUCCESS = 'success',
	INFINITY_EXTENT = 'infinity_extent',
	DEFAULT = 'default'
}
export enum EStates {
	act = 'act',
	nsw = 'nsw',
	nt = 'nt',
	qld = 'qld',
	sa = 'sa',
	tas = 'tas',
	vic = 'vic',
	wa = 'wa',
	ot = 'ot'
}

export enum EModalType {
	ListingId = 'listingId',
	CompareProperty = 'compareProperty'
}

export enum EGroupLabel {
	suburb = 'Suburb',
	property = 'Property',
	street = 'Street',
	recentSearch = 'Recent Searches',
	project = 'Projects',
	lga = 'Local Council Area',
	state = 'State',
	city = 'City',
	school = 'School'
}

export enum EGroupIcon {
	locationPin = 'LOCATION_PIN',
	property = 'PROPERTY',
	street = 'STREET',
	building = 'BUILDING',
	none = 'NONE',
	project = 'PROJECT',
	school = 'SCHOOL'
}

export enum EAlertTypes {
	ofi = 'OFI',
	list = 'LIST',
	auction = 'AUCTION'
}

export enum ESaveSearchFrequency {
	daily = 'Daily',
	weekly = 'Weekly'
}

export enum EPropertyImageSource {
	REV = 'REV',
	REIP = 'REIP',
	GOOGLE = 'GOOGLE',
	NONE = 'NONE',
	NEARMAP = 'NEARMAP'
}

export enum EBadgeColors {
	Orange = 'Orange',
	Green = 'Green',
	Primary = 'Primary',
	Red = 'Red',
	Purple = 'Purple',
	Pink = 'Pink',
	Dull = 'Dull',
	White = 'White'
}

export enum EAppsPageType {
	ListingSr = 'ListingSr',
	NewDevHome = 'NewDevHome',
	NewDevSr = 'NewDevSr',
	NewDevParentDetail = 'NewDevParentDetail',
	NewDevChildDetail = 'NewDevChildDetail',
	SchoolSr = 'SchoolSr'
}

export enum EModuleType {
	HOME = 'HOME',
	PROJECT = 'PROJECT',
	SCHOOL = 'SCHOOL'
}
