import { ListingEntityTypeAnalyticsService } from '@listingSr/core/services/analytics/listingEntityTypeAnalyticsService';
import { EListingEntityType } from '@realestateview/avesta-js-core';
import { EAppsPageType } from '@shared/types/enums';
import { NewDevSrAnalyticsForParentService } from '@newDevelopment/core/services/analytics/newDevSrAnalyticsForParentService';
import { NewDevSrAnalyticsForChildService } from '@newDevelopment/core/services/analytics/newDevSrAnalyticsForChildService';
import { EAccommodationType } from '@shared/types/matomo';
import { SchoolCatchmentNdSrAnalyticsService } from '@schoolCatchment/core/services/analytics/schoolCatchmentNdSrAnalyticsService';
import { SchoolCatchmentListingSrAnalyticsService } from '@schoolCatchment/core/services/analytics/schoolCatchmentListingSrAnalyticsService';
import { ListingService } from './listingService';

export class EntityTypeAnalyticsStrategyFactory {
	constructor(public listingService: ListingService) {}

	getNewDevAnalyticsService(accommodationType: EAccommodationType) {
		if (accommodationType === EAccommodationType.Range) {
			return new NewDevSrAnalyticsForParentService();
		}

		return new NewDevSrAnalyticsForChildService();
	}

	getStrategy(appsPageType: EAppsPageType, entityType?: EListingEntityType) {
		if (appsPageType === EAppsPageType.SchoolSr) {
			if (entityType === EListingEntityType.project) {
				return new SchoolCatchmentNdSrAnalyticsService(this.listingService);
			} else {
				return new SchoolCatchmentListingSrAnalyticsService(this.listingService);
			}
		}
		if (appsPageType === EAppsPageType.NewDevSr) {
			return new NewDevSrAnalyticsForParentService();
		}

		return new ListingEntityTypeAnalyticsService(this.listingService);
	}
}
