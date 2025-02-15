import { LocationChangeHandlerFactory } from '@searchResult/services/locationChangeHandlerFactory.service';
import { INavigationService } from '@shared/interfaces/navigationService';
import { RecentSearchService } from '@searchResult/services/recentSearch.service';
import { LocationChangeCommand } from '@searchResult/commands/locationChange.command';
import { CacheService } from '@searchResult/infrastructure/repositories/interfaces/cacheService.interface';
import { AnalyticsManagerService } from '@shared/services/analyticsManagerService';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { ELocationGroupId } from '@searchResult/types/enums';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { ListingSrMapper } from '@searchResult/mappers/listingSr.mapper';

export class LocationChangeUseCase {
	constructor(
		private srAnalyticsService: SrAnalyticsService,
		private cacheService: CacheService,
		private recentSearchService: RecentSearchService,
		private navigationService: INavigationService,
		private listingSrRepository: ListingSrRepository,
		private analyticsManagerService: AnalyticsManagerService,
		private recentlyViewService: RecentlyViewService,
		private toasterService: IToasterService
	) {}

	async execute(command: LocationChangeCommand) {
		const { appliedFilters, searchKeyword, selectedLocations, fromModuleType, props, screenName } = command;
		if (selectedLocations.length === 0) return;

		this.cacheService.clear();
		const locationChangeHandler = new LocationChangeHandlerFactory(
			this.srAnalyticsService,
			this.recentSearchService,
			this.navigationService,
			this.listingSrRepository,
			this.analyticsManagerService,
			this.recentlyViewService
		).create(selectedLocations[0].groupId! as ELocationGroupId);

		const handlerFilterParams = ListingSrMapper.toHandlerFilter(appliedFilters!);
		try {
			const locationChangeHandlerResponse = await locationChangeHandler.handle({
				appliedFilters: handlerFilterParams!,
				searchKeyword,
				selectedLocations,
				fromModuleType,
				props,
				screenName
			});

			return locationChangeHandlerResponse;
		} catch (error) {
			this.toasterService.customToaster(error.message || EToastMsg.somethingWrong, 'error');
		}
	}
}
