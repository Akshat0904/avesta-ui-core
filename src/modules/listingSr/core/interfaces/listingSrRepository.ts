import { IListingSrData } from '@realestateview/avesta-js-core';
import {
	TListingDetailByIds,
	TListingGridIdsResponse,
	TListingDetails,
	TListingSrResponse,
	TGridDetails,
	TBoundingBox
} from '@listingSr/core/types/listingSrTypes';
import { EnquiryToAgentApiBody, EnquiryToAgentApiResponse } from '@searchResult/types/types';

export interface IListingSrRepository {
	getSearchResultsByLocation: (aParams: IListingSrData) => Promise<TListingSrResponse>;
	getListingsBySurroundedBoundaries: (boundingBox: TBoundingBox) => Promise<TListingSrResponse>;
	getListingsByGridIds: (gridDetails: IListingSrData & TGridDetails) => Promise<TListingGridIdsResponse>;
	getListingsByIds: (listingDetails: TListingDetails) => Promise<TListingDetailByIds>;
	postEnquiryToAgent: (enquiryData: EnquiryToAgentApiBody) => Promise<EnquiryToAgentApiResponse>;
}
