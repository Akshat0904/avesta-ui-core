import { TListingAndNdDetailPageResponse } from '@newDevelopment/core/types/newDevelopmentTypes';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import { NewDevDetailAnalyticsService } from './newDevDetailAnalyticsService';

export class NewDevChildDetailAnalyticsService extends NewDevDetailAnalyticsService {
	protected data: TListingAndNdDetailPageResponse;
	constructor(analyticsService: IAnalyticsService, data: TListingAndNdDetailPageResponse) {
		super(analyticsService, data);
	}
	public getAccommodationDetails() {
		const data = this.data;
		return {
			bathroom: data.bathrooms,
			bedroom: data.bedrooms,
			carpark: data.carparks,
			propertyType: data.primaryPropertyType
		};
	}

	public getId() {
		return this.data.id.toString();
	}
}
