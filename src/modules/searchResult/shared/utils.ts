import { EListingCategory } from '@listingSr/core/types/listingSrEnum';
import { ESaleMethod } from '@realestateview/avesta-js-core';
import { ListingSrPageResponse, LocationRecord, PinP360 } from '@searchResult/types/listingSrResponse';
import { ELocationTypes } from '@shared/types/enums';
import { TSelectedMarkersData } from '@shared/types/types';

export const getSelectedLocationNameFromResponse = (srPageResponse: ListingSrPageResponse) => {
	const locationName: string[] = [];
	if (srPageResponse.streetESRecords && srPageResponse.streetESRecords.length > 0) {
		const streetDetails = srPageResponse.streetESRecords[0];
		return [
			`${capitalizeEachWord(streetDetails.streetName)}, ${capitalizeEachWord(streetDetails.suburbName)}, ${
				streetDetails.state
			} ${streetDetails.postcode}`
		];
	}
	if (srPageResponse.schoolInfo && srPageResponse.schoolInfo.length > 0) {
		const { full_name, state_code, postcode } = srPageResponse.schoolInfo[0];
		return [`${full_name}, ${[state_code.toUpperCase()]} ${postcode}`];
	}
	if (srPageResponse.locationESRecords && srPageResponse.locationESRecords.length > 0) {
		for (let i = 0; i < srPageResponse.locationESRecords.length; i++) {
			locationName.push(getSelectedLocationName(srPageResponse.locationESRecords[i]));
		}
		return locationName;
	}
	return ['Map Area'];
};

export const getSelectedLocationName = (location: LocationRecord) => {
	const suburbName = capitalizeEachWord(location.suburbName || '');
	const state = location.state.toUpperCase() || '';
	const postcode = location.postcode || '';
	const city = capitalizeEachWord(location.city || '');
	const lgaName = capitalizeEachWord(location.lgaName || '');

	if (location.locationType === ELocationTypes.state) {
		return getStateFullName(state);
	} else if (location.locationType === ELocationTypes.suburb) {
		return `${suburbName}, ${state} ${postcode}`;
	} else if (location.locationType === ELocationTypes.city) {
		return `${city}, ${state} (City)`;
	}
	return `${lgaName}, ${state}`;
};

export const getStateFullName = (state: string) => {
	switch (state.toLowerCase()) {
		case 'vic':
			return 'Victoria';
		case 'act':
			return 'Australian Capital Territory';
		case 'nsw':
			return 'New South Wales';
		case 'nt':
			return 'Northern Territory';
		case 'qld':
			return 'Queensland';
		case 'sa':
			return 'South Australia';
		case 'tas':
			return 'Tasmania';
		case 'wa':
			return 'Western Australia';
		case 'ot':
			return 'Other Territory';
		default:
			return 'Australia';
	}
};

export const capitalizeEachWord = (str: string): string => {
	if (!str) {
		return '';
	}
	str = str.toLowerCase();
	str = str.replace(/\b(\w)/g, (match) => match.toUpperCase());
	return str;
};

export const getSelectedMarkersData = (listingSrResponse: ListingSrPageResponse, markerData: TSelectedMarkersData) => {
	if (markerData.isListing) {
		return listingSrResponse.pins.find((pin) => pin.id === markerData.id);
	}
	return listingSrResponse.p360Properties.data.find((property) => property.seoSlug === markerData.id);
};

export const getPropertyPriceText = (aP360Property: PinP360) => {
	if (!aP360Property.avmHigh && !aP360Property.avmLow) {
		return 'Estimate unavailable';
	}

	let avmLow;
	let avmHigh;

	if (aP360Property.avmLow) {
		avmLow = `$${formatPrice(aP360Property.avmLow, 1)}`;
	}
	if (aP360Property.avmHigh) {
		avmHigh = `$${formatPrice(aP360Property.avmHigh, 1)}`;
	}

	if (avmLow && avmHigh) {
		return `${avmLow} - ${avmHigh}`;
	}
	if (avmHigh) return avmHigh;
	if (avmLow) return avmLow;

	return '';
};

export const getPropertyFullAddress = (property: PinP360) => {
	return `${property.streetAddress}, ${property.suburbName}, ${property.state} ${property.postcode}`;
};

export const formatPrice = (num: number, precision = 2) => {
	const map = [
		{ suffix: 'T', threshold: 1e12 },
		{ suffix: 'B', threshold: 1e9 },
		{ suffix: 'M', threshold: 1e6 },
		{ suffix: 'K', threshold: 1e3 },
		{ suffix: '', threshold: 1 }
	];

	const found = map.find((x) => Math.abs(num) >= x.threshold);
	if (found) {
		const formatted =
			((num / found.threshold) % 1 === 0 ? num / found.threshold : (num / found.threshold).toFixed(precision)) +
			found.suffix;
		return formatted;
	}

	return num;
};

export const getRecentSearchesTab = (saleMethod: ESaleMethod) => {
	switch (saleMethod) {
		case ESaleMethod.lease:
			return EListingCategory.rent;
		case ESaleMethod.sold:
			return EListingCategory.sold;
		default:
			return EListingCategory.buy;
	}
};
