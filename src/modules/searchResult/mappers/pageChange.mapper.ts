import { TListing, TPinListing, TProperties } from '@listingSr/core/types/listingSrTypes';
import {
	EListingEntityType,
	IListingSrData,
	ILocation,
	ISchoolCatchmentSrUrlFromData,
	UrlService
} from '@realestateview/avesta-js-core';

export class PageChangeMapper {
	static getLocationFromAppliedFilters(appliedFilters: IListingSrData): ILocation[] {
		if (!appliedFilters.locations || appliedFilters.locations.length === 0) {
			return [];
		}
		return appliedFilters.locations;
	}

	static getPinsForPage(pageNumber: number, size: number, pins: TPinListing[]) {
		const startIndex = (pageNumber - 1) * size;
		const pagePins = pins.slice(startIndex, startIndex + size);
		return pagePins;
	}

	static getListingQuery(pins: TPinListing[], appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData) {
		const listingIds = pins.map((pagePin) => pagePin.id);

		return {
			listingIds,
			saleMethod: appliedFilters.saleMethod[0]
		};
	}

	static applyFiltersToListings(listings: TListing[], filter?: IListingSrData) {
		const updatedListings = [...listings];
		return updatedListings.map((listing) => {
			if (listing.entityType === EListingEntityType.project && listing.title && listing.properties?.length) {
				const appliedFilterChildProperty: TProperties[] = [];
				listing.properties.forEach((property) => {
					switch (false) {
						case this.filterByBathrooms(property, filter):
							break;
						case this.filterByBedrooms(property, filter):
							break;
						case this.filterBycarparks(property, filter):
							break;
						case this.filterByPropertyTypes(property, filter):
							break;
						case this.filterByPriceFrom(property, filter):
							break;
						case this.filterByPriceTo(property, filter):
							break;
						case this.filterIsHidden(property):
							break;

						default:
							property.listingDetailLink = UrlService.ProjectDetail.getUrlFromProjectChildDetailData({
								...property,
								projectSlug: listing.projectSlug || ''
							});
							property.developmentContactNo = listing.developmentContactNo;
							property.inspections = listing.inspections;

							appliedFilterChildProperty.push(property);
							break;
					}
				});
				listing.properties = appliedFilterChildProperty;
				return listing;
			} else {
				return listing;
			}
		});
	}

	private static filterByBathrooms(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.bathrooms) {
			if (filter.exactBaths) {
				return property.bathrooms === filter.bathrooms;
			}
			return property.bathrooms >= filter.bathrooms;
		}
		return true;
	}
	private static filterByBedrooms(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.bedrooms) {
			if (filter.exactBeds) {
				return property.bedrooms === filter.bedrooms;
			}
			return property.bedrooms >= filter.bedrooms;
		}
		return true;
	}
	private static filterBycarparks(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.carparks) {
			if (filter.exactCars) {
				return property.carparks === filter.carparks;
			}
			return property.carparks >= filter.carparks;
		}
		return true;
	}

	private static filterByPropertyTypes(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.propertyTypes && filter.propertyTypes.length) {
			return filter.propertyTypes.some((element) =>
				property.propertyType?.toLowerCase().includes(element.toLowerCase())
			);
		}
		return true;
	}

	private static filterByPriceFrom(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.priceFrom) {
			return property.priceFrom >= filter.priceFrom;
		}
		return true;
	}

	private static filterByPriceTo(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.priceTo) {
			return property.priceFrom <= filter.priceTo;
		}
		return true;
	}

	private static filterIsHidden(property: TProperties) {
		return property.isHidden ? false : true;
	}
}
