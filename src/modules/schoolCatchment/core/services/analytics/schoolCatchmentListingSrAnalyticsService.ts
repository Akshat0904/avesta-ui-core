import { ListingService } from '@shared/services/listingService';
import { ESaleMethod } from '@realestateview/avesta-js-core';
import { EListingPageType } from '@shared/types/enums';
import { SchoolCatchmentSrAnalyticsService } from './schoolCatchmentSrAnalyticsService';

export class SchoolCatchmentListingSrAnalyticsService extends SchoolCatchmentSrAnalyticsService {
	constructor(listingService: ListingService) {
		super(listingService);
	}

	public getListingType(saleMethod: ESaleMethod[]): EListingPageType[] {
		return this.listingService.getListingTypeBySaleMethod(saleMethod);
	}
	public getAccommodationDetails(bathroom: string | number, bedroom: string | number, carParks: string | number) {
		return {
			bathroom: bathroom,
			bedroom: bedroom,
			carpark: carParks
		};
	}

	public getLandSizeAndFeaturesDetails(features?: string[], minLandArea?: number, maxLandArea?: number) {
		return {
			features: features || 'Any',
			minLandArea: minLandArea || 'Any',
			maxLandArea: maxLandArea || 'Any'
		};
	}
}
