import { NewDevEntityTypeAnalyticsService } from './newDevEntityTypeAnalyticsService';

export class NewDevSrAnalyticsForChildService extends NewDevEntityTypeAnalyticsService {
	public getAccommodationDetails(bathroom: string | number, bedroom: string | number, carParks: string | number) {
		return {
			bathroom: bathroom,
			bedroom: bedroom,
			carpark: carParks
		};
	}
}
