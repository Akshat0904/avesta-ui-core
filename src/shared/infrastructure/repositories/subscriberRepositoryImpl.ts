import { IHttpService } from '@shared/interfaces/httpService';
import {
	TListingPropertiesForComparisonResponse,
	TComparisonListingsInfo,
	TFetchGroupsResponse,
	TCreateNewGroupName,
	TSubscriberDetails,
	TSentInquiryToAgentResponse,
	TRecentlyViewedListingDetailBodyParams,
	TRecentlyViewedP360BodyParams,
	TResponse,
	TAddOrRemoveShortlistPropertyBodyParams,
	TSubscriberPropertyInfo,
	TAddEditNoteBodyParams,
	TAddEditNoteResponse,
	TDeleteNoteBodyParams,
	TSaveSearchResponse
} from '@shared/types/types';
import { ISubscriberRepository } from '../../interfaces/subscriberRepository';
import { IConfigService } from '../../interfaces/configService';
import { SaveSearch } from '@searchResult/types/types';

export class SubscriberRepositoryImpl implements ISubscriberRepository {
	constructor(private httpClient: IHttpService, private configService: IConfigService) {}
	async addListingsToComparisonGroup(
		bodyParams: TComparisonListingsInfo
	): Promise<TListingPropertiesForComparisonResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().saveListingsForComparison,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}
	async getSubscriberComparisonGroups(): Promise<TFetchGroupsResponse> {
		try {
			return this.httpClient.get<any>({
				path: this.configService.getApiPaths().fetchGroups
			});
		} catch (error) {
			throw error;
		}
	}

	async addNewComparisonGroup(bodyParams: TCreateNewGroupName): Promise<TListingPropertiesForComparisonResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().fetchGroups,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}

	async sendInquiryToAgent(userDetails: TSubscriberDetails): Promise<TSentInquiryToAgentResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().sentInquiryToAgent,
				body: userDetails
			});
		} catch (error) {
			throw error;
		}
	}

	async addPropertyToRecentlyViewed(
		bodyParams: (TRecentlyViewedP360BodyParams | TRecentlyViewedListingDetailBodyParams)[]
	): Promise<TResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().recentlyViewed,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}

	async addPropertyToShortlist(bodyParams: TAddOrRemoveShortlistPropertyBodyParams): Promise<TResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().shortlistListings,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}

	async removePropertyFromShortlist(bodyParams: TAddOrRemoveShortlistPropertyBodyParams): Promise<TResponse> {
		try {
			return this.httpClient.delete<any>({
				path: this.configService.getApiPaths().shortlistListings,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}

	async getSubscriberPropertyDetails(): Promise<TSubscriberPropertyInfo> {
		try {
			return this.httpClient.get<any>({
				path: this.configService.getApiPaths().subscriberShortlistFollowProperties
			});
		} catch (error) {
			throw error;
		}
	}

	async addNoteToProperty(bodyParams: TAddEditNoteBodyParams, listingId: number): Promise<TAddEditNoteResponse> {
		try {
			return this.httpClient.put<any>({
				path: `${this.configService.getApiPaths().addEditNote}${listingId}`,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}

	async removeNoteFromListing(bodyParams: TDeleteNoteBodyParams): Promise<TResponse> {
		try {
			return this.httpClient.delete<any>({
				path: `${this.configService.getApiPaths().addEditNote}${bodyParams.subscriberListingId}`,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}

	async saveSearchListingSrPage(bodyParams: SaveSearch): Promise<TSaveSearchResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.configService.getApiPaths().saveSearchListingSrPage,
				body: bodyParams
			});
		} catch (error) {
			throw error;
		}
	}
}
