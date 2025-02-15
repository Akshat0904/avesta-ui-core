import { TListing, TPinListing, TSrPageScreen } from '@listingSr/core/types/listingSrTypes';
import { renderMulSearchLocation } from '@listingSr/presentation/utils/utils';
import { ESaleMethod, IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { IEntityTypeAnalyticsStrategy } from '@shared/interfaces/entityTypeAnalyticsStrategy';
import { ListingService } from '@shared/services/listingService';
import { EListingPageType } from '@shared/types/enums';
import { EAnalyticsEventCategory, EAnalyticsTitleType, TListingCommonDimensions } from '@shared/types/matomo';

export abstract class SchoolCatchmentSrAnalyticsService implements IEntityTypeAnalyticsStrategy {
	protected listingService: ListingService;

	constructor(listingService: ListingService) {
		this.listingService = listingService;
	}
	getEventCategory(): EAnalyticsEventCategory {
		return EAnalyticsEventCategory.SchoolCatchment;
	}

	deriveUrlPathAndTitle(screen: TSrPageScreen) {
		if (screen === 'list-map') {
			return {
				url: 'search/schools/list-map',
				title: EAnalyticsTitleType.SchoolCatchmentSrListMapPage
			};
		}

		if (screen === 'map') {
			return {
				url: 'search/schools/map',
				title: EAnalyticsTitleType.SchoolCatchmentSrMapPage
			};
		}

		return {
			url: 'search/schools/list',
			title: EAnalyticsTitleType.SchoolCatchmentSrListPage
		};
	}

	protected abstract getAccommodationDetails(
		bathroom: string | number,
		bedroom: string | number,
		carParks: string | number
	): object;

	protected getAccommodations(bathroom: string | number, bedroom: string | number, carParks: string | number) {
		return this.getAccommodationDetails(bathroom, bedroom, carParks);
	}

	protected abstract getLandSizeAndFeaturesDetails(
		features?: string[],
		minLandArea?: number,
		maxLandArea?: number
	): object;

	protected getLandSizeAndFeatures(features?: string[], minLandArea?: number, maxLandArea?: number) {
		return this.getLandSizeAndFeaturesDetails(features, minLandArea, maxLandArea);
	}

	protected abstract getListingType(saleMethod: ESaleMethod[]): EListingPageType[];

	protected getListingTypeBySaleMethod(saleMethod: ESaleMethod[]) {
		return this.getListingType(saleMethod);
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
		const locationsData = this.getLocations(locations);

		const schoolName = this.getSchoolName(appliedFilters, locations);

		const accommodationDetails = this.getAccommodations(
			appliedFilters.bathrooms || 'Any',
			appliedFilters.bedrooms || 'Any',
			appliedFilters.carparks || 'Any'
		);

		const landSizeAndFeaturesDetails = this.getLandSizeAndFeatures(
			appliedFilters.features,
			appliedFilters.landSizeFrom,
			appliedFilters.landSizeTo
		);

		return {
			listingType: this.getListingTypeBySaleMethod(appliedFilters.saleMethod),
			lowerPrice: appliedFilters.priceFrom || 'Any',
			pageNo: appliedFilters.page,
			propertyType: appliedFilters.propertyTypes || 'Any',
			sortBy: appliedFilters.sort,
			upperPrice: appliedFilters.priceTo || 'Any',
			...landSizeAndFeaturesDetails,
			...accommodationDetails,
			...locationsData,
			schoolName
		};
	}

	getEventTrackingCommonDimensions(listing: TListing | TPinListing): TListingCommonDimensions {
		const bedroom = listing.bedroomText || '';

		const bathroom = listing.bathroomText || '';

		const carparks = listing.carparkText || '';

		const accommodationDetails = this.getAccommodations(bathroom, bedroom, carparks);

		return {
			listingId_GnafId: listing.id.toString(),
			listingType: this.listingService.getListingTypeByStatus(listing.status, listing.saleMethod),
			tierType: listing.rank,
			...(listing.agencyId && { agencyId: listing.agencyId }),
			...(listing.agentId &&
				listing.agentId.length > 0 && {
					agentId: listing.agentId[0]
				}),
			state: listing.state,
			city: listing.city,
			lgaName: listing.lgaName,
			suburb: listing.suburbName,
			propertyType: listing.primaryPropertyType,
			postCode: listing.postcode,
			street: listing.streetAddress || '',
			...accommodationDetails,
			landSize: listing.landSizeInSqm,
			isReipAgency: listing.agency && Boolean(listing.agency.isReipAgency),
			isReipListing: listing.isReipListing && Boolean(listing.isReipListing)
		};
	}
}
