import { TListingAndNdDetailPageResponse } from '@newDevelopment/core/types/newDevelopmentTypes';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import { NewDevDetailAnalyticsService } from './newDevDetailAnalyticsService';

export class NewDevParentDetailAnalyticsService extends NewDevDetailAnalyticsService {
	protected data: TListingAndNdDetailPageResponse;
	constructor(analyticsService: IAnalyticsService, data: TListingAndNdDetailPageResponse) {
		super(analyticsService, data);
	}

	public getAccommodationDetails() {
		const data = this.data;
		return {
			bathroomRange: data.bathroomText,
			bedroomRange: data.bedroomText,
			carparkRange: data.carparkText,
			propertyType: data.primaryPropertyType
		};
	}

	public getId() {
		return this.data.projectSlug || '';
	}
}
