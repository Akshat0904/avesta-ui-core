import { NewDevEntityTypeAnalyticsService } from './newDevEntityTypeAnalyticsService';

export class NewDevSrAnalyticsForParentService extends NewDevEntityTypeAnalyticsService {
	public getAccommodationDetails(bathroom: string | number, bedroom: string | number, carParks: string | number) {
		return {
			bathroomRange: bathroom,
			bedroomRange: bedroom,
			carparkRange: carParks
		};
	}
}
