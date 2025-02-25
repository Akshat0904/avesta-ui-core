import { IListingSrData } from '@realestateview/avesta-js-core';
import {
	BoundingBox,
	GridDetails,
	ListingDetailByIds,
	ListingDetails,
	ListingGridIdsResponse,
	ListingSrResponse
} from '@searchResult/types/types';

export interface ListingSrRepository {
	getSearchResultsByLocation: (aParams: IListingSrData) => Promise<ListingSrResponse>;
	getListingsBySurroundedBoundaries: (boundingBox: BoundingBox) => Promise<ListingSrResponse>;
	getListingsByGridIds: (gridDetails: IListingSrData | GridDetails) => Promise<ListingGridIdsResponse>;
	getListingsByIds: (listingDetails: ListingDetails) => Promise<ListingDetailByIds>;
}
