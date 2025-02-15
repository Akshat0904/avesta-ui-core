import { IListingSrData } from '@realestateview/avesta-js-core';
import { IHttpService } from '@shared/interfaces/httpService';
import {
	TListingDetailByIds,
	TListingGridIdsResponse,
	TListingDetails,
	TListingSrResponse,
	TGridDetails,
	TBoundingBox
} from '@listingSr/core/types/listingSrTypes';
import { IConfigService } from '@shared/interfaces/configService';
import { IListingSrRepository } from '../core/interfaces/listingSrRepository';
import { EnquiryToAgentApiBody, EnquiryToAgentApiResponse } from '@searchResult/types/types';

export class ListingSrRepositoryImpl implements IListingSrRepository {
	constructor(private httpClient: IHttpService, private config: IConfigService) {}

	async getSearchResultsByLocation(filters: IListingSrData): Promise<TListingSrResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.config.getApiPaths().searchListingsByLocation,
				body: filters
			});
		} catch (error) {
			throw error;
		}
	}

	async getListingsByIds(listingDetails: TListingDetails): Promise<TListingDetailByIds> {
		try {
			return this.httpClient.post<any>({
				path: this.config.getApiPaths().listingsByIds,
				body: listingDetails
			});
		} catch (error) {
			throw error;
		}
	}

	async getListingsByGridIds(gridDetails: IListingSrData & TGridDetails): Promise<TListingGridIdsResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.config.getApiPaths().listingsByBBox,
				body: gridDetails
			});
		} catch (error) {
			throw error;
		}
	}

	async getListingsBySurroundedBoundaries(boundingBox: TBoundingBox): Promise<TListingSrResponse> {
		try {
			return this.httpClient.post<any>({
				path: this.config.getApiPaths().listingsByBBox,
				body: boundingBox
			});
		} catch (error) {
			throw error;
		}
	}

	async postEnquiryToAgent(enquiryData: EnquiryToAgentApiBody): Promise<EnquiryToAgentApiResponse> {
		try {
			return await this.httpClient.post<EnquiryToAgentApiResponse>({
				path: this.config.getApiPaths().sentInquiryToAgent,
				body: enquiryData,
				config: {
					credentials: 'include'
				}
			});
		} catch (error) {
			return { success: false, err: error };
		}
	}
}
