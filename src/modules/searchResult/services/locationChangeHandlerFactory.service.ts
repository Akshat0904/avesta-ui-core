import { ELocationGroupId } from '@listingSr/core/types/listingSrEnum';
import { ListingChangeHandler } from '@searchResult/services/listingChangeHandler.service';
import { SchoolCatchmentChangeHandler } from '@searchResult/services/schoolCatchmentChangeHandler.service';
import { RecentSearchService } from '@searchResult/services/recentSearch.service';
import { INavigationService } from '@shared/interfaces/navigationService';
import { ProjectChangeHandler } from '@searchResult/services/projectChangeHandler.service';
import { AnalyticsManagerService } from '@shared/services/analyticsManagerService';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';

export class LocationChangeHandlerFactory {
	constructor(
		private srAnalyticsService: SrAnalyticsService,
		private recentSearchService: RecentSearchService,
		private navigationService: INavigationService,
		private listingSrRepository: ListingSrRepository,
		private analyticsManagerService: AnalyticsManagerService,
		private recentlyViewService: RecentlyViewService
	) {}
	create(groupId: ELocationGroupId) {
		switch (groupId) {
			// case ELocationGroupId.PROPERTY:
			// 	return new PropertyChangeHandler(
			// 		this.srAnalyticsService,
			// 		this.priceEstimatorRepository,
			// 		this.recentSearchService,
			// 		this.navigationService
			// 	);

			case ELocationGroupId.PROJECT:
				return new ProjectChangeHandler(this.navigationService);

			case ELocationGroupId.SCHOOL:
				return new SchoolCatchmentChangeHandler(
					this.listingSrRepository,
					this.srAnalyticsService,
					this.recentSearchService,
					this.analyticsManagerService,
					this.recentlyViewService
				);

			default:
				return new ListingChangeHandler(
					this.srAnalyticsService,
					this.listingSrRepository,
					this.recentSearchService,
					this.analyticsManagerService,
					this.recentlyViewService
				);
		}
	}
}
