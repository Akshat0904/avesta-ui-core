import { SaveSearch } from '@searchResult/types/types';
import { ILocalStorageService } from '../interfaces/localStorageService';
import { ISubscriberRepository } from '../interfaces/subscriberRepository';
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
	TSubscriberPropertyInfo,
	TAddEditNoteResponse,
	TAddEditNoteBodyParams,
	TDeleteNoteBodyParams,
	TSaveSearchResponse
} from '../types/types';
import { ShortlistCommand } from '@searchResult/commands/shortlist.command';
import { SavePropertyToCompareGroupCommand } from '@searchResult/commands/compareProperty.command';

export class SubscriberService {
	constructor(private repo: ISubscriberRepository, private storageService: ILocalStorageService) {}

	async addListingsToComparisonGroup(
		comparisonListingsInfo: SavePropertyToCompareGroupCommand
	): Promise<TListingPropertiesForComparisonResponse> {
		return this.repo.addListingsToComparisonGroup(comparisonListingsInfo);
	}

	async getSubscriberComparisonGroups(): Promise<TFetchGroupsResponse> {
		return this.repo.getSubscriberComparisonGroups();
	}

	async addNewComparisonGroup(bodyParams: TCreateNewGroupName): Promise<TListingPropertiesForComparisonResponse> {
		return this.repo.addNewComparisonGroup(bodyParams);
	}

	async sendInquiryToAgent(userDetails: TSubscriberDetails): Promise<TSentInquiryToAgentResponse> {
		return this.repo.sendInquiryToAgent(userDetails);
	}

	async addPropertyToRecentlyViewed(
		bodyParams: (TRecentlyViewedP360BodyParams | TRecentlyViewedListingDetailBodyParams)[]
	): Promise<TResponse> {
		return this.repo.addPropertyToRecentlyViewed(bodyParams);
	}

	async addPropertyToShortlist(bodyParams: ShortlistCommand): Promise<TResponse> {
		return this.repo.addPropertyToShortlist(bodyParams);
	}

	async removePropertyFromShortlist(bodyParams: ShortlistCommand): Promise<TResponse> {
		return this.repo.removePropertyFromShortlist(bodyParams);
	}

	async getSubscriberPropertyDetails(): Promise<TSubscriberPropertyInfo> {
		return this.repo.getSubscriberPropertyDetails();
	}

	async addNoteToProperty(bodyParams: TAddEditNoteBodyParams, listingId: number): Promise<TAddEditNoteResponse> {
		return this.repo.addNoteToProperty(bodyParams, listingId);
	}

	async removeNoteFromListing(bodyParams: TDeleteNoteBodyParams): Promise<TResponse> {
		return this.repo.removeNoteFromListing(bodyParams);
	}

	async saveSearchListingSrPage(bodyParams: SaveSearch): Promise<TSaveSearchResponse> {
		return this.repo.saveSearchListingSrPage(bodyParams);
	}

	getUser = () => {
		const userData = this.storageService.getItem('revUser');
		return !userData ? {} : JSON.parse(userData);
	};

	isLoggedIn = () => {
		const user = this.getUser();
		return Boolean(user?.userId);
	};
}
