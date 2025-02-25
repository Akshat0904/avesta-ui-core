import { IListingSrData, ILocation } from '@realestateview/avesta-js-core';

export interface INewDevHomeAnalyticsService {
	processPageViewEvents(selectedState: string, selectedBed: number, url: string): void;
	trackFeatureInvestmentInteraction(selectedState: string);
	trackBestInvestmentInteraction(selectedBed: number);
	trackFilterSearchInteraction(
		appliedFilters: IListingSrData,
		location: ILocation[],
		searchKeyword: string,
		slug?: string
	): void;
}
