import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';

export type UpdatedListingQuery = {
	listingSrResponse: TListingSrPageResponse;
	shortlistProperty?: string;
	projectId?: number | string;
	projectPropertiesId?: number | string;
	isShortListed: boolean;
};
