import { CommonHelpers, EListingStatus, ESaleMethod, IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { capitalizeEachWord, formatPrice, getStateFullName } from '@shared/utils/utils';
import { EAppsPageType, EListingPageType, ELocationTypes, EModuleType } from '@shared/types/enums';
import { TLocationSearchResponse, TRecentlyViewedProperties, TSelectedSearch } from '@shared/types/types';
import { TSelectedMarkersData } from '@shared/types/types';
import {
	TItems,
	TListing,
	TListingSrPageResponse,
	TLocationRecord,
	TPinListing,
	TPinP360
} from '../../core/types/listingSrTypes';

export const isDecimalNumber = (value: number) => {
	const number = Number(value);

	// Check if the number is finite (i.e., not NaN, Infinity, or -Infinity)
	// and not an integer
	return Number.isFinite(number) && !Number.isInteger(number);
};

export const isBBoxExist = (urlData: IListingSrData) => {
	if (
		urlData.topLeftLatitude &&
		urlData.topLeftLongitude &&
		urlData.bottomRightLatitude &&
		urlData.bottomRightLongitude
	) {
		return true;
	}
	return false;
};

export const getSelectedLocationName = (location: TLocationRecord) => {
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

export const getSelectedLocationNameFromSrPageResponse = (srPageResponse: TListingSrPageResponse) => {
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

export const isPrimaryFiltersIncluded = (urlData: IListingSrData) => {
	if (Boolean(urlData.bedrooms) || (urlData.propertyTypes && urlData.propertyTypes.length > 0)) {
		return true;
	}
	return false;
};

export const getSaleMethodIntent = (aSaleMethod: ESaleMethod[]): string => {
	const text = 'for';
	const saleMethods: string[] = [];

	if (aSaleMethod.includes(ESaleMethod.sale)) {
		saleMethods.push('Sale');
	}
	if (aSaleMethod.includes(ESaleMethod.lease)) {
		saleMethods.push('Rent');
	}
	if (aSaleMethod.includes(ESaleMethod.sold)) {
		saleMethods.push('Sold');
	}

	return `${text} ${saleMethods.join(', ').replace(/,([^,]*)$/, ' and$1')}`;
};

export const getMarkerData = (aPinsData: TPinListing[], aP360Data: TPinP360[]) => {
	const markersData = [
		{
			pins: aPinsData,
			p360Pins: aP360Data
		}
	];
	return markersData;
};

export const getSaleMethod = (status: EListingStatus | undefined, saleMethod: ESaleMethod) => {
	if (status?.toLowerCase() === EListingStatus.sold.toLowerCase()) {
		return ESaleMethod.sold;
	}
	if (saleMethod.toLowerCase() === ESaleMethod.lease.toLowerCase()) {
		return ESaleMethod.lease;
	}
	return ESaleMethod.sale;
};

export const renderPageType = (aMethod: ESaleMethod[]): EListingPageType => {
	return aMethod.includes(ESaleMethod.sale)
		? EListingPageType.buy
		: aMethod.includes(ESaleMethod.lease)
		? EListingPageType.rent
		: EListingPageType.sold;
};

export const getListingFullAddress = (listing: TListing) => {
	return CommonHelpers.getFullAddress({
		...listing,
		streetName: listing.streetAddress || '',
		isStreetHidden: listing.isStreetHidden
	});
};

export const getPropertyFullAddress = (property: TPinP360) => {
	return `${property.streetAddress}, ${property.suburbName}, ${property.state} ${property.postcode}`;
};

export const getPropertyPriceText = (aP360Property: TPinP360) => {
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

export const addRecentlyViewedFlagToListings = (
	recentlyViewedProperties: TRecentlyViewedProperties[],
	pins: TPinListing[]
): TPinListing[] => {
	const updatedPins = pins.map((property: TPinListing) => {
		if (
			recentlyViewedProperties.some(
				(recentProperty: TRecentlyViewedProperties) => recentProperty.id === property.id
			)
		) {
			return { ...property, isRecentlyViewed: true };
		}
		return property;
	});
	return updatedPins;
};

export const addRecentlyViewedFlagToP360Properties = (
	recentlyViewedProperties: TRecentlyViewedProperties[],
	p360Pins: TPinP360[]
): TPinP360[] => {
	const updatedPins = p360Pins.map((property: TPinP360) => {
		if (
			recentlyViewedProperties.some(
				(recentProperty: TRecentlyViewedProperties) => recentProperty.seoSlug === property.seoSlug
			)
		) {
			return { ...property, isRecentlyViewed: true };
		}
		return property;
	});
	return updatedPins;
};

export const updatePropertiesWithRecentlyView = (
	recentlyViewedProperties: TRecentlyViewedProperties[],
	data: TListingSrPageResponse
) => {
	let updatedPins = data.pins;
	let updatedP360Pins = data.p360Properties.data;
	if (data.pins) {
		updatedPins = addRecentlyViewedFlagToListings(recentlyViewedProperties, data.pins);
	}
	if (data.p360Properties.data) {
		updatedP360Pins = addRecentlyViewedFlagToP360Properties(recentlyViewedProperties, data.p360Properties.data);
	}

	return {
		...data,
		pins: updatedPins,
		p360Properties: { data: updatedP360Pins, total: data.p360Properties.total }
	};
};
export const getSelectedMarkersData = (listingSrResponse: TListingSrPageResponse, markerData: TSelectedMarkersData) => {
	if (markerData.isListing) {
		return listingSrResponse.pins.find((pin) => pin.id === markerData.id);
	}
	return listingSrResponse.p360Properties.data.find((property) => property.seoSlug === markerData.id);
};

export const getFormattedDate = (inputDateString: string): string => {
	if (inputDateString === '-') {
		return '-';
	}
	const inputDate = new Date(inputDateString);

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	const day = inputDate.getDate();
	const month = months[inputDate.getMonth()];
	const year = inputDate.getFullYear();

	let hours = inputDate.getHours();
	const amPm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12 || 12; // Convert to 12-hour format
	const minutes = inputDate.getMinutes();

	const formattedDate = `${day} ${month} ${year} - ${hours}.${minutes.toString().padStart(2, '0')}${amPm}`;
	return formattedDate;
};

export const getLocationBySelectedValue = (selected: TItems<TLocationSearchResponse>): ILocation[] => {
	const selectedLocation = selected && selected.value;
	const state = selectedLocation && selectedLocation.state.toLowerCase();
	if (!selected || !selected.value || !selectedLocation) {
		return [];
	}
	if (selected.groupId === 'state') {
		return [{ state }];
	}
	if (selected.groupId === 'city') {
		return [
			{
				state: state,
				city: selectedLocation.city,
				citySlug: CommonHelpers.slugify(selectedLocation.city || '')
			}
		];
	}
	if (selected.groupId === 'lga') {
		return [
			{
				state: state,
				lgaName: selectedLocation.lgaName,
				lgaSlug: CommonHelpers.slugify(selectedLocation.lgaName || '')
			}
		];
	}
	return [
		{
			state: state,
			suburbNameSlug: CommonHelpers.slugify(selectedLocation.suburbName || ''),
			suburbName: selectedLocation.suburbName,
			postcode: selectedLocation.postcode
		}
	];
};

export const getLocationsDetails = (selected: TSelectedSearch[], includeCityLga?: boolean) => {
	const tmp: ILocation[] = [];
	selected.forEach((item: any) => {
		const selectedLocation = item?.value;
		const state = selectedLocation?.state.toLowerCase() || '';
		if (!item || !selectedLocation) return;

		if (item.groupId === 'school') {
			const stateCode = selectedLocation.state_code?.toLowerCase() || '';
			return tmp.push({
				state: stateCode ? stateCode : selectedLocation.state,
				suburbName: selectedLocation.suburbName ?? selectedLocation.suburb,
				postcode: selectedLocation.postcode || '',
				schoolName: selectedLocation.schoolName ?? selectedLocation.full_name,
				schoolNameSlug: selectedLocation.schoolNameSlug || '',
				suburbNameSlug: selectedLocation.suburbSlug ?? selectedLocation.suburbNameSlug
			});
		}

		if (item.value && selectedLocation && item.groupId === 'state') {
			return tmp.push({ state });
		}
		if ('city' in selectedLocation && item.groupId === 'city') {
			return tmp.push({
				state: state,
				city: selectedLocation.city,
				citySlug: slugify(selectedLocation.city || '')
			});
		}

		if (item.groupId === 'lga' && 'lgaName' in selectedLocation) {
			return tmp.push({
				state: state,
				lgaName: selectedLocation.lgaName,
				lgaSlug: slugify(selectedLocation.lgaName || '')
			});
		}

		tmp.push({
			state: state,
			suburbNameSlug: slugify(selectedLocation.suburbName || ''),
			suburbName: selectedLocation.suburbName,
			postcode: selectedLocation.postcode,
			...(selectedLocation.streetName &&
				'streetName' in selectedLocation && { streetName: selectedLocation.streetName }),
			...(selectedLocation.streetSlug &&
				'streetSlug' in selectedLocation && { streetNameSlug: selectedLocation.streetSlug }),
			...(includeCityLga &&
				'city' in selectedLocation &&
				selectedLocation.city && { city: selectedLocation.city }),
			...(includeCityLga &&
				'lgaName' in selectedLocation &&
				selectedLocation.lgaName && { lgaName: selectedLocation.lgaName })
		});
		return tmp;
	});

	return tmp;
};

export const getImageSrc = (url: string) => {
	return url.split('/')[url.split('/').length - 1];
};

export const slugify = (text: string) => {
	return CommonHelpers.slugify(text);
};

export const renderMulSearchLocation = (locations: ILocation[]) => {
	if (locations && locations.length > 1) {
		return locations
			.map((location) => {
				const { state, suburbName, postcode } = location;
				return {
					state: state.toUpperCase(),
					suburbName: capitalizeEachWord(suburbName || ''),
					postcode: postcode
				};
			})
			.map((item) => Object.values(item).join('|'));
	}
	return [];
};

export const getAppsPageTypeFrom = (isFrom?: EModuleType) => {
	if (isFrom === EModuleType.SCHOOL) {
		return EAppsPageType.SchoolSr;
	}
	if (isFrom === EModuleType.PROJECT) {
		return EAppsPageType.NewDevSr;
	}
	return EAppsPageType.ListingSr;
};
