import { SaveSearch } from '@searchResult/types/types';
import {
	TListingPropertiesForComparisonResponse,
	TComparisonListingsInfo,
	TFetchGroupsResponse,
	TCreateNewGroupName,
	TSubscriberDetails,
	TSentInquiryToAgentResponse,
	TRecentlyViewedP360BodyParams,
	TRecentlyViewedListingDetailBodyParams,
	TResponse,
	TAddOrRemoveShortlistPropertyBodyParams,
	TSubscriberPropertyInfo,
	TAddEditNoteBodyParams,
	TAddEditNoteResponse,
	TDeleteNoteBodyParams,
	TSaveSearchResponse
} from '../types/types';

export interface ISubscriberRepository {
	addListingsToComparisonGroup: (
		comparisonListingsInfo: TComparisonListingsInfo
	) => Promise<TListingPropertiesForComparisonResponse>;
	getSubscriberComparisonGroups: () => Promise<TFetchGroupsResponse>;
	addNewComparisonGroup: (body: TCreateNewGroupName) => Promise<TListingPropertiesForComparisonResponse>;
	sendInquiryToAgent: (userDetails: TSubscriberDetails) => Promise<TSentInquiryToAgentResponse>;
	addPropertyToRecentlyViewed: (
		bodyParams: (TRecentlyViewedP360BodyParams | TRecentlyViewedListingDetailBodyParams)[]
	) => Promise<TResponse>;

	addPropertyToShortlist: (bodyParams: TAddOrRemoveShortlistPropertyBodyParams) => Promise<TResponse>;
	removePropertyFromShortlist: (bodyParams: TAddOrRemoveShortlistPropertyBodyParams) => Promise<TResponse>;
	getSubscriberPropertyDetails: () => Promise<TSubscriberPropertyInfo>;
	addNoteToProperty: (bodyParams: TAddEditNoteBodyParams, listingId: number) => Promise<TAddEditNoteResponse>;
	removeNoteFromListing: (bodyParams: TDeleteNoteBodyParams) => Promise<TResponse>;

	saveSearchListingSrPage: (bodyParams: SaveSearch) => Promise<TSaveSearchResponse>;
}
