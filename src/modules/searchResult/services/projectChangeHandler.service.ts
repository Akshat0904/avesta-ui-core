import { IProjectDetailUrlFromData, UrlService } from '@realestateview/avesta-js-core';
import { INavigationService } from '@shared/interfaces/navigationService';
import { LocationChangeHandler } from '@searchResult/infrastructure/repositories/interfaces/locationChange.interface';
import { LocationChangeHandlerCommand } from '@searchResult/commands/locationChange.command';
import { LocationMapper } from '@searchResult/mappers/location.mapper';

export class ProjectChangeHandler implements LocationChangeHandler {
	constructor(private navigationService: INavigationService) {}
	async handle(command: LocationChangeHandlerCommand) {
		const { selectedLocations, screenName, props } = command;
		const location = LocationMapper.toLocations(selectedLocations, false);

		const url = UrlService.ProjectDetail.getUrlFromProjectDetailData(location[0] as IProjectDetailUrlFromData);

		// this.recentSearchService.addLocationToRecentSearch(
		// 	[selectedLocations[0].displayName],
		// 	url,
		// 	appliedFilters,
		// 	location,
		// 	fromModuleType
		// );

		this.navigationService.navigateToDetailPage(url, screenName, props);
	}
}
