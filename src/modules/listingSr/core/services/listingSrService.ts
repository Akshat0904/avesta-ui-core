import {
	EListingEntityType,
	EListingSortTypes,
	EListingStatus,
	ESaleMethod,
	ESchoolCatchmentSrPageType,
	IListingSrData,
	ILocation,
	ISchoolCatchmentSrUrlFromData,
	UrlService
} from '@realestateview/avesta-js-core';
import {
	getLocationBySelectedValue,
	getLocationsDetails,
	getSelectedMarkersData,
	slugify
} from '@listingSr/presentation/utils/utils';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';
import {
	TLocationSearchResponse,
	TPropertyLocationDetails,
	TSelectedMarkersData,
	TSelectedSearch,
	TStreetDetails
} from '@shared/types/types';
import {
	TBoundingBox,
	TGridDetails,
	TItems,
	TListing,
	TListingDetailByIds,
	TListingDetails,
	TListingGridIdsResponse,
	TListingSrPageResponse,
	TPinListing,
	TPinP360,
	TProperties,
	TSelectedLocation
} from '@listingSr/core/types/listingSrTypes';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { TListingSrResponse } from '@listingSr/core/types/listingSrTypes';
import { IListingSrRepository } from '@listingSr/core/interfaces/listingSrRepository';
import { ISrCacheService } from '@shared/interfaces/srCacheService';
import { UrlServiceFactory } from '@shared/services/UrlServiceFactory';
import { ISrAnalyticsService } from '../interfaces/srAnalyticsService';

export class ListingSrService {
	constructor(
		private repo: IListingSrRepository,
		private storageService: ILocalStorageService,
		private srAnalyticsService: ISrAnalyticsService,
		private srCacheService: ISrCacheService
	) {}

	async getSearchListingsByLocation(
		deviceType: EAccessDeviceType,
		aFilters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		url?: string
	): Promise<TListingSrResponse> {
		const { pageType, ...rest } = aFilters;
		const body = {
			...rest,
			...(pageType === ESchoolCatchmentSrPageType.project && { onlyProject: true })
		};
		const listingSrResponse = await this.repo.getSearchResultsByLocation(body);

		try {
			this.srAnalyticsService.processPageViewEvents(deviceType, aFilters, listingSrResponse.data, url);
		} catch (error) {
			console.error('Tracking failed:', error);
		}

		return listingSrResponse;
	}

	async getListingsBySurroundedBoundaries(boundingBox: TBoundingBox): Promise<TListingSrResponse> {
		return this.repo.getListingsBySurroundedBoundaries(boundingBox);
	}
	private removeDuplicatePins(
		pins: (TPinListing | TPinP360)[],
		matchKeyName: string
	): { uniquePins: (TPinListing | TPinP360)[]; updatedCacheCount: number } {
		// Retrieve the existing pins from the cache
		let cachedPins;
		if (matchKeyName === 'id') {
			cachedPins = this.srCacheService.getPins();
		} else {
			cachedPins = this.srCacheService.getP360();
		}

		// Create a set to store unique identifiers of cached pins
		const cachedIds = new Set(cachedPins.map((pin) => pin[matchKeyName]));

		// Filter out pins that are already in the cache based on their unique identifier and count duplicates
		const uniquePins: (TPinListing | TPinP360)[] = [];
		let duplicateCount = 0;

		for (const pin of pins) {
			if (cachedIds.has(pin[matchKeyName])) {
				duplicateCount++;
			} else {
				uniquePins.push(pin);
			}
		}

		// Return the unique pins and the count of duplicates
		return { uniquePins, updatedCacheCount: cachedPins.length - duplicateCount };
	}

	private truncatePins(pins: (TPinListing | TPinP360)[], size: number): (TPinListing | TPinP360)[] {
		if (size === 0) {
			return pins; // Return the original array if size is 0
		} else {
			return pins.slice(0, -size); // Otherwise, truncate the array as before
		}
	}

	private mergePins(pins: (TPinListing | TPinP360)[], matchKeyName: string): (TPinListing | TPinP360)[] {
		let cachedPins;
		if (matchKeyName === 'id') {
			cachedPins = this.srCacheService.getPins();
		} else {
			cachedPins = this.srCacheService.getP360();
		}
		const mergedPins = [...cachedPins, ...pins];
		return mergedPins;
	}

	// private sortPins(pins: TPinListing[]): TPinListing[] {
	// 	return this.sortAndMergeUnifiedListings(pins);
	// 	// return pins.sort((a, b) => a.weightage - b.weightage);
	// }

	getUpdatedListingsFullData = async (
		pins: TPinListing[],
		listings: TListing[],
		aFilters: IListingSrData,
		deviceType: EAccessDeviceType
	) => {
		const first25Pins = pins.slice(0, 25);

		// Initialize variables to count pins with full data and store those with full data
		let fullDataCount = 0;
		const pinsWithFullData: TListing[] = [];

		// Compare each pin with the listings to find how many have full data
		for (const pin of first25Pins) {
			const matchingListing = listings.find((listing) => listing.id === pin.id);
			if (matchingListing) {
				fullDataCount++;
				pinsWithFullData.push(matchingListing);
			}
		}

		// Find the remaining pins that do not have full data
		const pinsWithoutFullData = first25Pins
			.filter((pin) => !listings.find((listing) => listing.id === pin.id))
			.map((item) => item.id);

		let updatedListings: TListing[] = [...pinsWithFullData];

		if (pinsWithoutFullData.length > 0) {
			const url = UrlService.ListingSr.getUrlFromListingSrData(aFilters);
			const response = await this.getListingsByIds(
				deviceType,
				aFilters,
				{
					listingIds: pinsWithoutFullData,
					saleMethod: aFilters.saleMethod[0]
				},
				url || ''
			);
			updatedListings = [...pinsWithFullData, ...response.data];
			updatedListings = this.sortAndMergeUnifiedListings({
				listing: updatedListings,
				sort: this.getSortOrderForListings(aFilters),
				saleMethod: aFilters.saleMethod[0]
			}) as TListing[];
		}

		return updatedListings;
	};

	private sortAndMergeUnifiedListings(params: {
		listing: (TPinListing | TListing)[];
		saleMethod: ESaleMethod;
		sort?: EListingSortTypes;
	}) {
		switch (true) {
			case params.sort === EListingSortTypes.priceAsc:
				params.listing = this.priceSort(params.saleMethod, params.listing, 'Asc');
				break;

			case params.sort === EListingSortTypes.priceDesc:
				params.listing = this.priceSort(params.saleMethod, params.listing, 'Desc');
				break;
			case params.sort === EListingSortTypes.dateDesc:
				params.listing.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;

			case params.sort === EListingSortTypes.updatedAtDesc:
				params.listing.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
				break;

			case params.sort === EListingSortTypes.suburbAsc:
				params.listing.sort((a, b) => a.suburbName.localeCompare(b.suburbName));
				break;

			case params.sort === EListingSortTypes.suburbDesc:
				params.listing.sort((a, b) => b.suburbName.localeCompare(a.suburbName));
				break;

			case params.sort === EListingSortTypes.bedroomsDesc:
				params.listing.sort((a, b) => b.bedrooms - a.bedrooms);
				break;

			case params.sort === EListingSortTypes.bedroomsAsc:
				params.listing.sort((a, b) => a.bedrooms - b.bedrooms);
				break;
			case params.saleMethod === ESaleMethod.sold:
				params.listing.sort((a, b) => {
					if (b.soldAt && a.soldAt && b.soldAt > a.soldAt) {
						return 1;
					} else {
						return -1;
					}
				});
				break;
			default:
				params.listing.sort((a, b) => a.weightage - b.weightage);
				break;
		}
		return params.listing;
	}

	priceSort(saleMethod: ESaleMethod, listings: (TPinListing | TListing)[], sort: 'Asc' | 'Desc') {
		const priceHiddenListing: (TPinListing | TListing)[] = [];
		const priceNotHiddenListings: (TPinListing | TListing)[] = [];

		listings.forEach((lis) => {
			if (
				(saleMethod !== ESaleMethod.sold && lis.isPriceHidden) ||
				(saleMethod === ESaleMethod.sold && lis.isSoldPriceHidden)
			) {
				return priceHiddenListing.push(lis);
			}
			return priceNotHiddenListings.push(lis);
		});
		if (saleMethod === ESaleMethod.lease) {
			priceNotHiddenListings.sort((a, b) => {
				return b.rentPerWeek - a.rentPerWeek;
			});
			priceHiddenListing.sort((a, b) => a.weightage - b.weightage);
		} else if (saleMethod === ESaleMethod.sold) {
			priceNotHiddenListings.sort((a, b) => Number(b.soldPrice) - Number(a.soldPrice));
			priceHiddenListing.sort((a, b) => a.weightage - b.weightage);
		} else {
			priceNotHiddenListings.sort((a, b) => b.priceFrom - a.priceFrom);
			priceHiddenListing.sort((a, b) => a.weightage - b.weightage);
		}

		if (sort === 'Asc') {
			priceNotHiddenListings.reverse();
		}

		return [...priceNotHiddenListings, ...priceHiddenListing];
	}

	getSortOrderForListings(filter: IListingSrData) {
		if (filter.sort && filter.sort !== EListingSortTypes.recommended) {
			return filter.sort;
		}

		if (
			filter.locations &&
			filter.locations[0] &&
			(filter.locations[0].suburbNameSlug || filter.locations[0].streetNameSlug)
		) {
			return filter.sort;
		}

		if (filter.zoom && filter.zoom >= 13) {
			return filter.sort;
		}
		return EListingSortTypes.updatedAtDesc;
	}
	async getListingsByGridIds(
		deviceType: EAccessDeviceType,
		aFilters: IListingSrData,
		gridDetails: IListingSrData & TGridDetails,
		url?: string
	): Promise<TListingGridIdsResponse> {
		const listingSrResponse = await this.repo.getListingsByGridIds(gridDetails);
		try {
			this.srAnalyticsService.processPageViewEvents(deviceType, aFilters, listingSrResponse.data, url);
		} catch (error) {
			console.error('Tracking failed:', error);
		}
		const { uniquePins, updatedCacheCount } = this.removeDuplicatePins(listingSrResponse.data.pins, 'id');
		const truncatedPins = this.truncatePins(uniquePins, updatedCacheCount);
		const mergedPins = this.mergePins(truncatedPins, 'id') as TPinListing[];
		// const sortedPins = this.sortPins(mergedPins);
		const sortedPins = this.sortAndMergeUnifiedListings({
			listing: mergedPins,
			sort: this.getSortOrderForListings(aFilters),
			saleMethod: aFilters.saleMethod[0]
		}) as TPinListing[];
		let mergedP360Pins: TPinP360[] = [];
		if (listingSrResponse.data.p360Properties.data.length > 0) {
			const { uniquePins, updatedCacheCount } = this.removeDuplicatePins(
				listingSrResponse.data.p360Properties.data,
				'gnafId'
			);
			const truncatedPins = this.truncatePins(uniquePins, updatedCacheCount);
			mergedP360Pins = this.mergePins(truncatedPins, 'gnafId') as TPinP360[];
		}

		const updatedListings = await this.getUpdatedListingsFullData(
			sortedPins,
			[...listingSrResponse.data.listings, ...this.srCacheService.getListings()],
			aFilters,
			deviceType
		);

		return {
			...listingSrResponse,
			data: {
				...listingSrResponse.data,
				pins: sortedPins,
				listings: updatedListings,
				p360Properties: { data: mergedP360Pins, total: mergedP360Pins?.length }
			}
		};
	}

	async getListingsByIds(
		deviceType: EAccessDeviceType,
		aFilters: IListingSrData,
		listingDetails: TListingDetails,
		url?: string
	): Promise<TListingDetailByIds> {
		const listingSrResponse = await this.repo.getListingsByIds(listingDetails);

		const location = this.getLocationFromAppliedFilters(aFilters);

		try {
			this.srAnalyticsService.trackPaginationInteraction(
				deviceType,
				aFilters,
				listingSrResponse.data,
				location,
				url
			);
		} catch (error) {
			console.error('Tracking failed:', error);
		}
		return listingSrResponse;
	}

	async handleStreetChangeWithArray(
		selectedLocation: TSelectedSearch[],
		appliedFilters: IListingSrData,
		deviceType: EAccessDeviceType,
		searchKeyword: string,
		isFrom?: EModuleType
	) {
		const streetLocation = this.getStreetLocationWithArray(selectedLocation);

		const newFilters = {
			...appliedFilters,
			locations: streetLocation,
			page: 1
		};

		streetLocation &&
			this.srAnalyticsService.trackFilterSearchInteraction(appliedFilters, streetLocation, searchKeyword);
		const url = await this.getStreetOrLocationUrlWithArray(selectedLocation, newFilters, isFrom);
		if (url) {
			try {
				const response = await this.getSearchListingsByLocation(deviceType, newFilters, url);

				return { response, newFilters, url };
			} catch (error) {
				throw error;
			}
		} else {
			throw new Error('url not generated from UrlService');
		}
	}

	async handleLocationChangeWithArray(
		selectedLocation: TSelectedLocation[],
		appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		deviceType: EAccessDeviceType,
		searchKeyword: string,
		isFrom?: EModuleType
	) {
		const locations = getLocationsDetails(selectedLocation as TSelectedSearch[]);

		const { pageType, ...rest } = appliedFilters;
		const newFilters = {
			...rest,
			page: 1,
			locations
		};
		this.srAnalyticsService.trackFilterSearchInteraction(appliedFilters, locations, searchKeyword);

		const url = await this.getStreetOrLocationUrlWithArray(selectedLocation, newFilters, isFrom);

		if (url) {
			try {
				const response = await this.getSearchListingsByLocation(deviceType, { ...newFilters, pageType }, url);

				return { response, newFilters: { ...newFilters, pageType }, url };
			} catch (error) {
				throw error;
			}
		} else {
			throw new Error('URL not generated from UrlService');
		}
	}

	getStreetLocationWithArray = (selectedLocation: TSelectedSearch[]) => {
		if (!selectedLocation || !selectedLocation[0]) return;
		const streetDetails = selectedLocation[0].value as TStreetDetails;
		return [
			{
				state: streetDetails.state.toLowerCase() || '',
				suburbNameSlug: slugify(streetDetails.suburbName || ''),
				suburbName: streetDetails.suburbName,
				postcode: streetDetails.postcode,
				streetName: streetDetails.streetName,
				streetNameSlug: slugify(streetDetails.streetName)
			}
		];
	};

	private async getStreetOrLocationUrlWithArray(
		selectedLocation: TSelectedSearch[],
		appliedFilters: IListingSrData,
		isFrom?: EModuleType
	): Promise<string | undefined> {
		const { zoom, size, ...restAppliedFilters } = this.prepareFiltersForUrlWithArray(
			selectedLocation,
			appliedFilters
		);

		const url = UrlServiceFactory.getUrlStrategy(isFrom || EModuleType.PROJECT);
		return url?.getUrlFromSrData(restAppliedFilters);

		return '';
		// if (isFrom === EModuleType.NewDevelopment) {
		// 	return UrlService.ProjectSr.getUrlFromProjectSrData(restAppliedFilters);
		// } else {
		// 	return UrlService.ListingSr.getUrlFromListingSrData(restAppliedFilters);
		// }
	}

	private prepareFiltersForUrlWithArray(
		selectedLocation: TSelectedSearch[],
		appliedFilters: IListingSrData
	): IListingSrData {
		if (!selectedLocation[0]) return { ...appliedFilters };
		const locations =
			selectedLocation && 'streetName' in selectedLocation[0].value
				? this.getStreetLocationWithArray(selectedLocation as TSelectedSearch[])
				: getLocationsDetails(selectedLocation as TSelectedSearch[]);

		return { ...appliedFilters, locations };
	}

	getUrlFromListingSrData(isFrom: EModuleType, appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData) {
		const url = UrlServiceFactory.getUrlStrategy(isFrom);
		return url?.getUrlFromSrData(appliedFilters);
		// return '';
		// if (isFrom === EModuleType.NewDevelopment) {
		// 	return UrlService.ProjectSr.getUrlFromProjectSrData(appliedFilters);
		// }
		// return UrlService.ListingSr.getUrlFromListingSrData(appliedFilters);
	}

	getPropertiesBySelectedMarkers(listingSrResponse: TListingSrPageResponse, selectedMarkers: TSelectedMarkersData[]) {
		const selectedProperties = listingSrResponse.p360Properties.data.filter((pin) =>
			selectedMarkers.some((selectedMarker) => selectedMarker.id === pin.seoSlug)
		);
		const selectedListings = listingSrResponse.pins.filter((pin) =>
			selectedMarkers.some((selectedMarker) => selectedMarker.id === pin.id)
		);
		return {
			listings: selectedListings,
			properties: selectedProperties
		};
	}

	getBadgeTextForListing(status: EListingStatus, saleMethod: ESaleMethod) {
		if (status === EListingStatus.comingSoon) return 'Coming Soon';

		if (status === EListingStatus.sold) return 'Sold';

		if (saleMethod === ESaleMethod.lease) return 'Rent';

		return 'Buy';
	}

	getPinsForPage(pageNumber: number, size: number, pins: TPinListing[]) {
		const startIndex = (pageNumber - 1) * size;
		const pagePins = pins.slice(startIndex, startIndex + size);
		return pagePins;
	}

	getTotalPaginationTilesForSrListing(pinsTotal: number, size: number) {
		return Math.ceil(pinsTotal / size);
	}

	getLocationFromAppliedFilters(appliedFilters: IListingSrData): ILocation[] {
		if (!appliedFilters.locations || appliedFilters.locations.length === 0) {
			return [];
		}
		return appliedFilters.locations;
	}

	mapListingsToDataLayer(listings: TListing[]) {
		if (!listings || listings.length === 0) {
			return [];
		}

		const dataLayerInfo: Record<string, any> = {};

		listings.forEach((listing) => {
			const listingPropertyId = `listing_${listing.id}`;

			dataLayerInfo[listingPropertyId] = {
				num_bedrooms: listing.bedrooms || 0,
				num_bathrooms: listing.bathrooms || 0,
				total_parking: listing.carparks || 0,
				state: listing.state || '',
				...(listing.city && { city: listing.city }),
				...(listing.lgaName && { council: listing.lgaName }),
				suburb: listing.suburbName || '',
				postcode: listing.postcode || '',
				property_type: listing.primaryPropertyType || ''
			};
		});

		return dataLayerInfo;
	}

	isSelectedMarkersAreOnSameLocation(
		previewSelection: TSelectedMarkersData[],
		listingSrResponse: TListingSrPageResponse
	) {
		return previewSelection.some((property, index) => {
			const propertyLocation = getSelectedMarkersData(listingSrResponse, property)?.location;
			if (!propertyLocation) return false;

			for (let i = index + 1; i < previewSelection.length; i++) {
				const nextPropertyLocation = getSelectedMarkersData(listingSrResponse, previewSelection[i])?.location;
				if (!nextPropertyLocation) continue;

				if (
					propertyLocation.lat === nextPropertyLocation.lat &&
					propertyLocation.lon === nextPropertyLocation.lon
				) {
					return true;
				}
			}

			return false;
		});
	}

	sortListingsByIsListing(properties: (TPinListing | TPinP360)[]) {
		const propertiesCopy = [...properties];
		return propertiesCopy.sort((aProperty, aListing) => {
			if (aProperty.isListing === true && aListing.isListing !== true) {
				return -1;
			} else if (aProperty.isListing !== true && aListing.isListing === true) {
				return 1;
			}
			return 0;
		});
	}

	modifyProjectProfileChildProperties(listings: TListing[], filter?: IListingSrData) {
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

	filterByBathrooms(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.bathrooms) {
			if (filter.exactBaths) {
				return property.bathrooms === filter.bathrooms;
			}
			return property.bathrooms >= filter.bathrooms;
		}
		return true;
	}
	filterByBedrooms(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.bedrooms) {
			if (filter.exactBeds) {
				return property.bedrooms === filter.bedrooms;
			}
			return property.bedrooms >= filter.bedrooms;
		}
		return true;
	}
	filterBycarparks(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.carparks) {
			if (filter.exactCars) {
				return property.carparks === filter.carparks;
			}
			return property.carparks >= filter.carparks;
		}
		return true;
	}

	filterByPropertyTypes(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.propertyTypes && filter.propertyTypes.length) {
			return filter.propertyTypes.some((element) =>
				property.propertyType?.toLowerCase().includes(element.toLowerCase())
			);
		}
		return true;
	}

	filterByPriceFrom(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.priceFrom) {
			return property.priceFrom >= filter.priceFrom;
		}
		return true;
	}

	filterByPriceTo(property: TProperties, filter?: IListingSrData) {
		if (filter && filter.priceTo) {
			return property.priceFrom <= filter.priceTo;
		}
		return true;
	}

	filterIsHidden(property: TProperties) {
		return property.isHidden ? false : true;
	}
}
