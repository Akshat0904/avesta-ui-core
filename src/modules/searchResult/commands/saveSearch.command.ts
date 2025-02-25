import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EAlertTypes, ESaveSearchFrequency } from '@searchResult/types/enums';
import { SaveSearchLocation, SaveSearchLocationRecord, SaveSearchStreetRecord } from '@searchResult/types/types';

export type SaveSearchCommand = {
	label?: string;
	saleMethod: string;
	alertType: EAlertTypes;
	priceFrom?: number;
	priceTo?: number;
	bedrooms?: number;
	bathrooms?: number;
	carSpaces?: number;
	exactBeds?: boolean;
	exactBaths?: boolean;
	exactCars?: boolean;
	locations?: SaveSearchLocation[];
	propertyTypes?: number[];
	sendFrequency: ESaveSearchFrequency;
	sendAlert: boolean;
	onlyProject?: boolean;
	topLeftLatitude?: number;
	topLeftLongitude?: number;
	bottomRightLatitude?: number;
	bottomRightLongitude?: number;
	appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	locationRecord?: SaveSearchLocationRecord[];
	street?: SaveSearchStreetRecord[];
};
