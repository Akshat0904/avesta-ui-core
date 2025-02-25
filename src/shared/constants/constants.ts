import { TCompareConfiguresDetails, TSelectedConfigures, TTitleSubTitle } from '../types/types';

export const debounceDelayKeys = {
	delay: 100,
	twoHundredDelay: 200,
	threeHundredDelay: 300,
	mapInteractionDelay: 500,
	listingSrLocationSearchDelayForMobile: 400,
	listingSrLocationSearchDelayForDesktop: 300
};
export const generalCompareConfigureDetails: TCompareConfiguresDetails[] = [
	{
		title: 'Price/Property Address',
		configureName: 'isPropertyAddress'
	},
	{
		title: 'Auction Date',
		configureName: 'isAuctionDate'
	},
	{
		title: 'Inspection Date',
		configureName: 'isInspectionDate'
	},
	{
		title: 'Property Type',
		configureName: 'isPropertyType'
	},
	{
		title: 'Bed, Bath and Car details',
		configureName: 'isAccommodationDetails'
	},
	{
		title: 'Land Size',
		configureName: 'isLandSize'
	},
	{
		title: 'Type',
		configureName: 'isType'
	}
];

export const selectedComparisonConfigures: TSelectedConfigures = {
	isPropertyAddress: true,
	isAuctionDate: true,
	isInspectionDate: true,
	isPropertyType: true,
	isAccommodationDetails: true,
	isLandSize: true,
	isType: true,
	isPropertyImage: true
};

export const existingCompareGroupHeading: TTitleSubTitle = {
	title: 'Select Group',
	subTitle: 'Select from existing group or create new'
};
export const newCompareGroupHeading: TTitleSubTitle = {
	title: 'Create new group',
	subTitle:
		'Your properties will be added to the new group. You can access all your comparison properties in your preference centre.'
};

export const deviceTypeLatLong = {
	desktop: [190.9959106, -37.8219536],
	mobile: [144.9959106, -37.8219536]
};

export const storageKeys = {
	recentSearchLocations: 'RECENT_SEARCH_LOCATIONS'
};

export const ANALYTICS = {
	BATCH_SIZE: 25,
	BATCH_INTERVAL_MS: 2500
};
