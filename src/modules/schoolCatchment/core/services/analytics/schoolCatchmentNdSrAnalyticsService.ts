import { ListingService } from '@shared/services/listingService';
import { EListingPageType } from '@shared/types/enums';
import { SchoolCatchmentSrAnalyticsService } from './schoolCatchmentSrAnalyticsService';

export class SchoolCatchmentNdSrAnalyticsService extends SchoolCatchmentSrAnalyticsService {
	constructor(listingService: ListingService) {
		super(listingService);
	}

	public getListingType(): EListingPageType[] {
		return [];
	}
	public getAccommodationDetails(bathroom: string | number, bedroom: string | number, carParks: string | number) {
		return {
			bathroom,
			bedroom,
			carpark: carParks
		};
	}
	public getLandSizeAndFeaturesDetails() {
		return {
			features: [],
			minLandArea: '',
			maxLandArea: ''
		};
	}
}
