import { TListing, TPinListing, TSrPageScreen } from '@listingSr/core/types/listingSrTypes';
import { renderMulSearchLocation } from '@listingSr/presentation/utils/utils';
import { IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { IEntityTypeAnalyticsStrategy } from '@shared/interfaces/entityTypeAnalyticsStrategy';
import { EAnalyticsEventCategory, EAnalyticsTitleType, TNdListingCommonDimensions } from '@shared/types/matomo';

export abstract class NewDevEntityTypeAnalyticsService implements IEntityTypeAnalyticsStrategy {
	getEventCategory(): EAnalyticsEventCategory {
		return EAnalyticsEventCategory.NewDevelopments;
	}

	protected abstract getAccommodationDetails(
		bathroom: string | number,
		bedroom: string | number,
		carParks: string | number
	): object;

	protected getAccommodations(bathroom: string | number, bedroom: string | number, carParks: string | number) {
		return this.getAccommodationDetails(bathroom, bedroom, carParks);
	}

	deriveUrlPathAndTitle(screen: TSrPageScreen) {
		if (screen === 'list-map') {
			return {
				url: 'search/new-developments/list-map',
				title: EAnalyticsTitleType.NewDevSrListMapPage
			};
		}

		if (screen === 'map') {
			return {
				url: 'search/new-developments/map',
				title: EAnalyticsTitleType.NewDevSrMapPage
			};
		}

		return {
			url: 'search/new-developments/list',
			title: EAnalyticsTitleType.NewDevSrListPage
		};
	}

	private getLocations(locations: ILocation[]) {
		if (!locations || !locations.length) {
			return {
				state: '',
				city: '',
				lgaName: '',
				suburb: '',
				postCode: '',
				street: ''
			};
		}
		return {
			state: locations[0].state,
			city: locations[0].city,
			lgaName: locations[0].lgaName,
			suburb: locations[0].suburbName,
			postCode: locations[0].postcode,
			street: locations[0].streetName,
			suburbMul: renderMulSearchLocation(locations)
		};
	}

	getSchoolName(appliedFilters: IListingSrData, locations: ILocation[]): string {
		if (locations?.length && locations[0].schoolName) {
			return locations[0].schoolName;
		}

		if (appliedFilters.locations?.length && appliedFilters.locations[0].schoolName) {
			return appliedFilters.locations[0].schoolName;
		}

		return '';
	}

	getPageViewCommonDimensions(appliedFilters: IListingSrData, locations: ILocation[]) {
		// const accommodationDetails = this.getAccommodations(
		// 	appliedFilters.bathrooms || 'Any',
		// 	appliedFilters.bedrooms || 'Any',
		// 	appliedFilters.carparks || 'Any'
		// );

		const locationsData = this.getLocations(locations);

		const schoolName = this.getSchoolName(appliedFilters, locations);

		return {
			lowerPrice: appliedFilters.priceFrom || 'Any',
			pageNo: appliedFilters.page,
			propertyType: appliedFilters.propertyTypes || 'Any',
			sortBy: appliedFilters.sort,
			upperPrice: appliedFilters.priceTo || 'Any',
			// ...accommodationDetails,
			bedroom: appliedFilters.bedrooms || 'Any',
			bathroom: appliedFilters.bathrooms || 'Any',
			carpark: appliedFilters.carparks || 'Any',
			...locationsData,
			schoolName
		};
	}

	getEventTrackingCommonDimensions(listing: TListing | TPinListing): TNdListingCommonDimensions {
		const bedroom = listing.bedroomText || '';

		const bathroom = listing.bathroomText || '';

		const carparks = listing.carparkText || '';

		const accommodationDetails = this.getAccommodations(bathroom, bedroom, carparks);

		return {
			listingId_GnafId: listing.projectSlug,
			state: listing.state,
			city: listing.city,
			lgaName: listing.lgaName,
			suburb: listing.suburbName,
			propertyType: listing.primaryPropertyType,
			postCode: listing.postcode,
			street: listing.streetAddress || '',
			...accommodationDetails,
			landSize: listing.landSizeInSqm
		};
	}
}
