import { TFilterCountDetails } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData } from '@realestateview/avesta-js-core';

export interface IListingRepository {
	getListingsCount: (filterDetails: IListingSrData) => Promise<TFilterCountDetails>;
}
