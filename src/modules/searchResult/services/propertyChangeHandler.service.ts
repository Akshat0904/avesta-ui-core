import { UrlService } from '@realestateview/avesta-js-core';
import { IPropertyRepository } from '@listingSr/core/interfaces/priceEstimatorRepository';
import { INavigationService } from '@shared/interfaces/navigationService';
import { TPropertyLocationDetails } from '@shared/types/types';
import { LocationChangeHandlerCommand } from '@searchResult/commands/locationChange.command';
import { SrFilter } from '@searchResult/types/types';
import { LocationChangeHandler } from '@searchResult/infrastructure/repositories/interfaces/locationChange.interface';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';

export class PropertyChangeHandler implements LocationChangeHandler {
	constructor(
		private srAnalyticsService: SrAnalyticsService,
		private propertyRepository: IPropertyRepository,
		// private recentSearchService: RecentSearchService,
		private navigationService: INavigationService
	) {}

	async handle(command: LocationChangeHandlerCommand) {
		const { selectedLocations, appliedFilters, searchKeyword, fromModuleType, screenName, props } = command;

		const selectedLocation = selectedLocations[0].value;

		this.trackSearchInteraction(appliedFilters, selectedLocation as TPropertyLocationDetails, searchKeyword);

		try {
			const url = await this.getDetailUrl(selectedLocation as TPropertyLocationDetails);

			if (!url) return;

			// this.addToRecentSearch(
			// 	fromModuleType,
			// 	selectedLocation as TPropertyLocationDetails,
			// 	url,
			// 	selectedLocations[0].displayName
			// );
			this.navigateToDetailPage(url, screenName, props);
		} catch (error) {
			throw error;
		}
	}

	private trackSearchInteraction(
		appliedFilters: SrFilter,
		selectedLocation: TPropertyLocationDetails,
		searchKeyword: string
	): void {
		this.srAnalyticsService.trackFilterSearchInteraction(
			appliedFilters,
			[selectedLocation],
			searchKeyword,
			selectedLocation.gnafId
		);
	}

	private async getDetailUrl(selectedLocation: TPropertyLocationDetails): Promise<string> {
		if (selectedLocation.gnafId) {
			const url = await this.propertyRepository.getDetailUrl(selectedLocation.gnafId);
			if (url) {
				return url;
			}
		}
		return UrlService.PriceEstimator.getUrlFromData(selectedLocation);
	}

	// private addToRecentSearch(
	// 	fromModuleType: EModuleType | undefined,
	// 	selectedLocation: TPropertyLocationDetails,
	// 	url: string,
	// 	displayName: string
	// ): void {
	// 	if (fromModuleType !== EModuleType.PROJECT) {
	// 		this.recentSearchService.addPropertyToRecentSearch([displayName], url, [selectedLocation], fromModuleType);
	// 	}
	// }

	private navigateToDetailPage(
		url: string,
		screenName: string | undefined,
		props: Record<string, unknown> | undefined
	): void {
		this.navigationService.navigateToDetailPage(url, screenName, props);
	}
}
