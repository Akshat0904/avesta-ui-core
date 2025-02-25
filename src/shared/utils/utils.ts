import { EPropertyTypes } from '@realestateview/avesta-js-core';
import moment from 'moment';
import { EAvmConfidenceColor, EAvmConfidence } from '@listingSr/core/types/listingSrEnum';

export const removeObjectKeys = <T>(obj: T, keys: (keyof T)[]): T => {
	const newObj = { ...obj };
	keys.forEach((key) => {
		delete newObj[key];
	});
	return newObj;
};

export const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
export const capitalizeEachWord = (str: string): string => {
	if (!str) {
		return '';
	}
	str = str.toLowerCase();
	str = str.replace(/\b(\w)/g, (match) => match.toUpperCase());
	return str;
};

export const getMultiplePropertyTypesWithComma = (propertyTypes: EPropertyTypes[]) => {
	return `${propertyTypes.join('s, ').replace(/,([^,]*)$/, ' and$1')}s`;
};

export const addPlural = (count: number, text: string) => {
	return count > 1 ? `${count} ${text}s` : `${count} ${text}`;
};

export const cleanObject = (obj: Record<string, unknown>): Record<string, unknown> => {
	for (const key in obj) {
		if (obj[key] === undefined) {
			delete obj[key];
		}
	}

	return obj;
};

export const removeDuplicateObjectsFromArray = (arr: any, prop: any) => {
	const uniqueObjects: any = {};
	const result: any = [];

	for (const obj of arr) {
		const key = obj[prop];
		if (!uniqueObjects[key]) {
			result.push(obj);
			uniqueObjects[key] = true;
		}
	}

	return result;
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

export const getPropertyConfidenceColor = (confidence: string) => {
	switch (confidence) {
		case EAvmConfidence.Low:
			return EAvmConfidenceColor.Low;
		case EAvmConfidence.MediumLow:
			return EAvmConfidenceColor.MediumLow;
		case EAvmConfidence.Medium:
			return EAvmConfidenceColor.Medium;
		case EAvmConfidence.MediumHigh:
			return EAvmConfidenceColor.MediumHigh;
		default:
			return EAvmConfidenceColor.High;
	}
};

export const filterObj = (keys: string[], obj: any) => {
	const newObj: any = {};
	for (const key in obj) {
		if (keys.includes(key)) {
			newObj[key] = obj[key];
		}
	}
	return newObj;
};

export const extractReferralQueryParams = (queryParams: string): string => {
	// covert query params into object
	const params = Object.fromEntries(new URLSearchParams(queryParams));

	//extract keys
	const paramKeys = Object.keys(params);

	//checking gclid types keys
	const filteredGclidKeys = paramKeys.filter((key) => {
		if (!key.match('gclid')) {
			return false;
		}
		return key;
	});

	if (filteredGclidKeys.length > 0 && filteredGclidKeys[0] === 'gclid') {
		const gclid = {
			utm_campaign: 'google-ad',
			utm_source: 'gclid',
			utm_id: params[filteredGclidKeys[0]]
		};

		const searchParams = new URLSearchParams(gclid);
		return searchParams.toString();
	}

	//checking utm_ types keys
	const filteredKeys = paramKeys.filter((key) => {
		if (!key.match('utm_')) {
			return false;
		}
		return key;
	});

	// filter object based on filters utm params
	const resultantParams = filterObj(filteredKeys, params);

	// converting utm based object to url query params
	const searchParams = new URLSearchParams(resultantParams);

	// convert into string
	return searchParams.toString();
};

export const getFormattedDate = (date: string) => {
	const dateResponse = date;
	const dateTime = moment(dateResponse, 'DD-MM-YYYY hh:mm:ss A');
	const today = moment();
	const yesterday = moment(today).subtract(1, 'day').format('DD/MM/YYYY');
	const lastSaturday = moment(today).subtract(6, 'day').format('DD/MM/YYYY');
	const monthDateFormat = moment(dateResponse, 'DD-MM-YYYY').format('MMM D');
	let formattedDate;
	if (dateTime.format('DD/MM/YYYY') === today.format('DD/MM/YYYY')) {
		formattedDate = 'Today';
	} else if (dateTime.format('DD/MM/YYYY') === yesterday) {
		formattedDate = 'Yesterday';
	} else if (dateTime.format('DD/MM/YYYY') === lastSaturday) {
		formattedDate = 'Last Saturday';
	} else {
		formattedDate = monthDateFormat;
	}
	return formattedDate;
};

export const getUtmString = (url: string) => {
	const splitUrl = url.split('?');

	const queryParamsString = splitUrl.length > 0 ? `?${splitUrl[1]}` : '';

	return extractReferralQueryParams(queryParamsString);
};

export const isEqualArray = <T>(value1: T[], value2: T[]) => {
	if (value1.length !== value2.length) {
		return false;
	}

	for (let i = 0; i < value1.length; i++) {
		if (value1[i] !== value2[i]) {
			return false;
		}
	}

	return true;
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

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getFutureDates = (daysArray: string[]) => {
	const currentDate = new Date();

	const futureDates: string[] = [];
	let currentPointerDate = new Date(currentDate);

	for (const day of daysArray) {
		const targetDayIndex = dayNames.indexOf(day);

		let daysToAdd = (targetDayIndex + 7 - currentPointerDate.getDay()) % 7;
		if (daysToAdd === 0 && futureDates.length > 0) {
			daysToAdd = 7;
		}

		currentPointerDate.setDate(currentPointerDate.getDate() + daysToAdd);
		const formattedDate = currentPointerDate.toISOString().split('T')[0];
		futureDates.push(formattedDate);

		currentPointerDate = new Date(currentPointerDate);
	}

	return futureDates;
};

const normalizeStateName = (state: string) => {
	return state.replace(/[-\s]/g, '').toLowerCase();
};

export const getStateShortName = (state: string) => {
	switch (normalizeStateName(state)) {
		case 'victoria':
			return 'VIC';
		case 'australiancapitalterritory':
			return 'ACT';
		case 'newsouthwales':
			return 'NSW';
		case 'northernterritory':
			return 'NT';
		case 'queensland':
			return 'QLD';
		case 'southaustralia':
			return 'SA';
		case 'tasmania':
			return 'TAS';
		case 'westernaustralia':
			return 'WA';
		case 'otherterritory':
			return 'OT';
		default:
			return state.toUpperCase();
	}
};
