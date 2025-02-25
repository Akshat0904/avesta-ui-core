import { EAccessDeviceType } from '@shared/types/enums';
import { SrAnalyticsService } from '@searchResult/infrastructure/repositories/interfaces/analyticsService.interface';
import { ISrCacheService } from '@shared/interfaces/srCacheService';
import { ListingSrRepository } from '@searchResult/infrastructure/repositories/interfaces/listingSr.repository';
import { EListingSortTypes, ESaleMethod, IListingSrData, ILocation, UrlService } from '@realestateview/avesta-js-core';
import { ListingDetailByIds, ListingDetails, ListingGridIdsResponse } from '@searchResult/types/types';
import { PinP360, PinListing, Listing } from '@searchResult/types/listingSrResponse';
import { TPinListing } from '@listingSr/core/types/listingSrTypes';

// Define the new interface at the top of the file
interface ProcessListingSrResponseParams {
	response: ListingGridIdsResponse;
	filters: IListingSrData;
	deviceType: EAccessDeviceType;
	url?: string;
}

// Separate class for handling pin operations
class PinService {
	constructor(private srCacheService: ISrCacheService) {}

	removeDuplicatePins(pins: (PinListing | PinP360)[], matchKeyName: string) {
		let cachedPins;
		if (matchKeyName === 'id') {
			cachedPins = this.srCacheService.getPins();
		} else {
			cachedPins = this.srCacheService.getP360();
		}

		const cachedIds = new Set(cachedPins.map((pin) => pin[matchKeyName]));
		const uniquePins: (PinListing | PinP360)[] = [];
		let duplicateCount = 0;

		for (const pin of pins) {
			if (cachedIds.has(pin[matchKeyName])) {
				duplicateCount++;
			} else {
				uniquePins.push(pin);
			}
		}

		return { uniquePins, updatedCacheCount: cachedPins.length - duplicateCount };
	}

	truncatePins(pins: (PinListing | PinP360)[], size: number) {
		return size === 0 ? pins : pins.slice(0, -size);
	}

	mergePins(pins: (PinListing | PinP360)[], matchKeyName: string) {
		let cachedPins;
		if (matchKeyName === 'id') {
			cachedPins = this.srCacheService.getPins();
		} else {
			cachedPins = this.srCacheService.getP360();
		}
		return [...cachedPins, ...pins];
	}
}

// Separate class for handling listing operations
class ListingService {
	constructor(private srCacheService: ISrCacheService) {}

	sortAndMergeListings(params: {
		listing: (PinListing | Listing)[];
		sort?: EListingSortTypes;
		saleMethod: ESaleMethod;
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

	priceSort(saleMethod: ESaleMethod, listings: (PinListing | any)[], sort: 'Asc' | 'Desc') {
		const priceHiddenListing: (PinListing | any)[] = [];
		const priceNotHiddenListings: (PinListing | any)[] = [];

		listings.forEach((lis) => {
			if (
				(saleMethod !== ESaleMethod.sold && lis.isPriceHidden) ||
				(saleMethod === ESaleMethod.sold && lis.isSoldPriceHidden)
			) {
				priceHiddenListing.push(lis);
			} else {
				priceNotHiddenListings.push(lis);
			}
		});

		if (saleMethod === ESaleMethod.lease) {
			priceNotHiddenListings.sort((a, b) => b.rentPerWeek - a.rentPerWeek);
		} else if (saleMethod === ESaleMethod.sold) {
			priceNotHiddenListings.sort((a, b) => Number(b.soldPrice) - Number(a.soldPrice));
		} else {
			priceNotHiddenListings.sort((a, b) => b.priceFrom - a.priceFrom);
		}

		priceHiddenListing.sort((a, b) => a.weightage - b.weightage);

		if (sort === 'Asc') {
			priceNotHiddenListings.reverse();
		}

		return [...priceNotHiddenListings, ...priceHiddenListing];
	}

	getSortOrderForListings(filter: IListingSrData): EListingSortTypes {
		if (filter.sort && filter.sort !== EListingSortTypes.recommended) {
			return filter.sort;
		}
		if (
			filter.locations &&
			filter.locations[0] &&
			(filter.locations[0].suburbNameSlug || filter.locations[0].streetNameSlug)
		) {
			return filter.sort as EListingSortTypes;
		}
		if (filter.zoom && filter.zoom >= 13) {
			return filter.sort as EListingSortTypes;
		}
		return EListingSortTypes.updatedAtDesc;
	}
}

// Main service class
export class ListingSrCacheService {
	public MAX_PINS = this.srCacheService.MAX_PINS;
	public MAX_LISTINGS = this.srCacheService.MAX_LISTINGS;

	private pinService: PinService;
	private listingService: ListingService;

	constructor(
		private srCacheService: ISrCacheService,
		private srAnalyticsService: SrAnalyticsService,
		private listingSrRepository: ListingSrRepository
	) {
		this.pinService = new PinService(srCacheService);
		this.listingService = new ListingService(srCacheService);
	}

	public async processListingSrResponse({
		response,
		filters,
		deviceType,
		url
	}: ProcessListingSrResponseParams): Promise<ListingGridIdsResponse> {
		const { uniquePins: listingPins, updatedCacheCount: listingCacheCount } = this.pinService.removeDuplicatePins(
			response.data.pins,
			'id'
		);
		const truncatedListingPins = this.pinService.truncatePins(listingPins, listingCacheCount);
		const mergedListingPins = this.pinService.mergePins(truncatedListingPins, 'id') as PinListing[];
		const sortedListingPins = this.listingService.sortAndMergeListings({
			listing: mergedListingPins,
			sort: this.listingService.getSortOrderForListings(filters),
			saleMethod: filters.saleMethod[0]
		}) as PinListing[];

		let mergedP360Pins: PinP360[] = [];
		if (response.data.p360Properties.data.length > 0) {
			const { uniquePins: p360Pins, updatedCacheCount: p360CacheCount } = this.pinService.removeDuplicatePins(
				response.data.p360Properties.data,
				'gnafId'
			);
			const truncatedP360Pins = this.pinService.truncatePins(p360Pins, p360CacheCount);
			mergedP360Pins = this.pinService.mergePins(truncatedP360Pins, 'gnafId') as PinP360[];
		}

		const updatedListings = await this.getUpdatedListingsFullData(
			sortedListingPins,
			[...response.data.listings, ...this.srCacheService.getListings()],
			filters,
			deviceType
		);

		return {
			...response,
			data: {
				...response.data,
				pins: sortedListingPins,
				listings: updatedListings,
				p360Properties: { data: mergedP360Pins, total: mergedP360Pins?.length }
			}
		};
	}

	public updateCache(
		markersInBound: { listingPinsInBound: PinListing[]; p360PinsInBound: PinP360[] },
		listings: any[]
	): void {
		if (markersInBound) {
			this.srCacheService.updatePins(markersInBound.listingPinsInBound as TPinListing[]);
			this.srCacheService.updateP360(markersInBound.p360PinsInBound);
			this.srCacheService.updateListings(listings);
		}
	}

	public clear(): void {
		this.srCacheService.clear();
	}

	public async getUpdatedListingsFullData(
		pins: PinListing[],
		listings: any[],
		filters: IListingSrData,
		deviceType: EAccessDeviceType
	): Promise<any[]> {
		const first25Pins = pins.slice(0, 25);

		let fullDataCount = 0;
		const pinsWithFullData: Listing[] = [];

		for (const pin of first25Pins) {
			const matchingListing = listings.find((listing) => listing.id === pin.id);
			if (matchingListing) {
				fullDataCount++;
				pinsWithFullData.push(matchingListing);
			}
		}

		const pinsWithoutFullData = first25Pins
			.filter((pin) => !listings.find((listing) => listing.id === pin.id))
			.map((item) => item.id);

		let updatedListings: Listing[] = [...pinsWithFullData];

		if (pinsWithoutFullData.length > 0) {
			const url = UrlService.ListingSr.getUrlFromListingSrData(filters);
			const response = await this.getListingsByIds(
				deviceType,
				filters,
				{
					listingIds: pinsWithoutFullData,
					saleMethod: filters.saleMethod[0]
				},
				url || ''
			);
			updatedListings = [...pinsWithFullData, ...response.data];
			updatedListings = this.listingService.sortAndMergeListings({
				listing: updatedListings,
				sort: this.listingService.getSortOrderForListings(filters),
				saleMethod: filters.saleMethod[0]
			}) as Listing[];
		}

		return updatedListings;
	}

	async getListingsByIds(
		deviceType: EAccessDeviceType,
		filters: IListingSrData,
		listingDetails: ListingDetails,
		url?: string
	): Promise<ListingDetailByIds> {
		const listingSrResponse = await this.listingSrRepository.getListingsByIds(listingDetails);

		const location = this.getLocationFromAppliedFilters(filters);

		try {
			this.srAnalyticsService.trackPaginationInteraction(
				deviceType,
				filters,
				listingSrResponse.data,
				location,
				url
			);
		} catch (error) {
			console.error('Tracking failed:', error);
		}
		return listingSrResponse;
	}

	private getLocationFromAppliedFilters(appliedFilters: IListingSrData): ILocation[] {
		if (!appliedFilters.locations || appliedFilters.locations.length === 0) {
			return [];
		}
		return appliedFilters.locations;
	}
}
