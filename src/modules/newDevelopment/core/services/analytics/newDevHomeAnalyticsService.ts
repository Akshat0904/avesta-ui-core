import { renderMulSearchLocation } from '@listingSr/presentation/utils/utils';
import { INewDevHomeAnalyticsService } from '@newDevelopment/core/interface/newDevHomeAnalyticsService';
import { IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	EAnalyticsTitleType
} from '@shared/types/matomo';

export class NewDevHomeAnalyticsService implements INewDevHomeAnalyticsService {
	private eventCategory = EAnalyticsEventCategory.NewDevelopments;
	constructor(private analyticsService: IAnalyticsService) {}

	trackBestInvestmentInteraction(selectedBed: number) {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.ViewBedroomBestInvestment,
			'',
			'',
			EAnalyticsEventType.NdViewBedroomBestInvestment,
			{
				bedroom: selectedBed
			}
		);
	}

	trackFeatureInvestmentInteraction(selectedState: string) {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.ViewStateFeatureInvestment,
			'',
			'',
			EAnalyticsEventType.NdViewStateFeatureInvestment,
			{
				...(selectedState.toLowerCase() !== 'all' && { state: selectedState })
			}
		);
	}

	trackPageView() {
		this.analyticsService.trackPageView(EAnalyticsTitleType.NewDevHomePage, '/new-developments/', {});
	}

	processPageViewEvents(selectedState: string, selectedBed: number): void {
		this.trackPageView();
		this.trackFeatureInvestmentInteraction(selectedState);
		this.trackBestInvestmentInteraction(selectedBed);
	}

	private getPageViewCommonDimensions(appliedFilters: IListingSrData, location: ILocation[], slug?: string) {
		return {
			state: location[0].state,
			city: location[0].city,
			lgaName: location[0].lgaName,
			suburb: location[0].suburbName,
			...(!slug && { bathroom: appliedFilters.bathrooms || 'Any' }),
			...(!slug && { bedroom: appliedFilters.bedrooms || 'Any' }),
			...(!slug && { carpark: appliedFilters.carparks || 'Any' }),
			...(slug && { bathroomRange: (appliedFilters.bathrooms || 'Any').toString() }),
			...(slug && { bedroomRange: (appliedFilters.bedrooms || 'Any').toString() }),
			...(slug && { carparkRange: (appliedFilters.carparks || 'Any').toString() }),
			lowerPrice: appliedFilters.priceFrom || 'Any',
			postCode: location[0].postcode,
			propertyType: appliedFilters.propertyTypes || 'Any',
			street: location[0].streetName,
			upperPrice: appliedFilters.priceTo || 'Any',
			suburbMul: renderMulSearchLocation(location) || '',
			schoolName: location[0].schoolName
		};
	}

	trackFilterSearchInteraction(
		appliedFilters: IListingSrData,
		location: ILocation[],
		searchKeyword: string,
		slug?: string
	): void {
		const category = location[0].schoolNameSlug ? EAnalyticsEventCategory.SchoolCatchment : this.eventCategory;

		this.analyticsService.trackEvent(category, EAnalyticsEventAction.Search, '', '', EAnalyticsEventType.NdSearch, {
			listingId_GnafId: slug,
			...this.getPageViewCommonDimensions(appliedFilters, location, slug),
			searchKeyword
		});
	}
}
