import { TListing, TPinListing, TPinP360 } from '@listingSr/core/types/listingSrTypes';

export interface ISrCacheService {
	MAX_PINS: number;
	MAX_LISTINGS: number;

	updatePins(pins: TPinListing[]): void;
	updateListings(listings: TListing[]): void;
	updateP360(p360: TPinP360[]): void;
	clear(): void;

	getPins(): TPinListing[];
	getListings(): TListing[];
	getP360(): TPinP360[];
}
