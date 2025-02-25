import { TListing, TPinListing, TSrPageScreen } from '@listingSr/core/types/listingSrTypes';
import { renderMulSearchLocation } from '@listingSr/presentation/utils/utils';
import { IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import { IEntityTypeAnalyticsStrategy } from '@shared/interfaces/entityTypeAnalyticsStrategy';
import { ListingService } from '@shared/services/listingService';
import { EAnalyticsEventCategory, EAnalyticsTitleType, TListingCommonDimensions } from '@shared/types/matomo';

export class ListingEntityTypeAnalyticsService implements IEntityTypeAnalyticsStrategy {
	constructor(private listingService: ListingService) {}
	getEventCategory(): EAnalyticsEventCategory {
		return EAnalyticsEventCategory.Listings;
	}

	deriveUrlPathAndTitle(screen: TSrPageScreen) {
		if (screen === 'list-map') {
			return {
				url: 'search/listings/list-map',
				title: EAnalyticsTitleType.ListingSrListMapPage
			};
		}

		if (screen === 'map') {
			return {
				url: 'search/listings/map',
				title: EAnalyticsTitleType.ListingSrMapPage
			};
		}

		return {
			url: 'search/listings/list',
			title: EAnalyticsTitleType.ListingSrListPage
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
		const locationsData = this.getLocations(locations);

		const schoolName = this.getSchoolName(appliedFilters, locations);

		return {
			listingType: this.listingService.getListingTypeBySaleMethod(appliedFilters.saleMethod),
			bathroom: appliedFilters.bathrooms || 'Any',
			bedroom: appliedFilters.bedrooms || 'Any',
			carpark: appliedFilters.carparks || 'Any',
			...(!schoolName && { includeSurrSuburb: appliedFilters.includeSurrounding }),
			lowerPrice: appliedFilters.priceFrom || 'Any',
			pageNo: appliedFilters.page,
			propertyType: appliedFilters.propertyTypes || 'Any',
			sortBy: appliedFilters.sort,
			upperPrice: appliedFilters.priceTo || 'Any',
			features: appliedFilters.features || 'Any',
			minLandArea: appliedFilters.landSizeFrom || 'Any',
			maxLandArea: appliedFilters.landSizeTo || 'Any',
			...locationsData,
			schoolName
		};
	}

	getEventTrackingCommonDimensions(listing: TListing | TPinListing): TListingCommonDimensions {
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
			bedroom: listing.bedrooms,
			bathroom: listing.bathrooms,
			carpark: listing.carparks,
			propertyType: listing.primaryPropertyType,
			postCode: listing.postcode,
			street: listing.streetAddress || '',
			landSize: listing.landSizeInSqm,
			...(Boolean(listing.isReipListing) && {
				isReipListing: listing.isReipListing
			}),
			...(listing.agency &&
				Boolean(listing.agency.isReipAgency) && {
					isReipAgency: listing.agency.isReipAgency
				})
		};
	}
}
