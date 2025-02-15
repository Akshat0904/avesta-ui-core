import { IListingDetailUrlFromData, IListingSrData, IProjectDetailUrlFromData } from '@realestateview/avesta-js-core';

export interface IUrlService {
	getUrlFromSrData(listingData: IListingSrData): string | undefined;
	getUrlFromDetailData(listingData: IProjectDetailUrlFromData | IListingDetailUrlFromData): string | undefined;
}
