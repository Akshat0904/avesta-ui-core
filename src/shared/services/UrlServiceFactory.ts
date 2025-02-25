import {
	IListingDetailUrlFromData,
	IListingSrData,
	IProjectDetailUrlFromData,
	UrlService
} from '@realestateview/avesta-js-core';
// import { EModuleType } from '@searchResult/types/enums';
import { IUrlService } from '@shared/interfaces/UrlServiceFactory';
import { EModuleType } from '@shared/types/enums';

class ListingUrlService implements IUrlService {
	getUrlFromSrData(listingData: IListingSrData) {
		return UrlService.ListingSr.getUrlFromListingSrData(listingData);
	}
	getUrlFromDetailData(listingData: IListingDetailUrlFromData) {
		return UrlService.ListingDetail.getUrlFromListingDetailData(listingData);
	}
}

class NewDevUrlService implements IUrlService {
	getUrlFromSrData(listingData: IListingSrData) {
		return UrlService.ProjectSr.getUrlFromProjectSrData(listingData);
	}
	getUrlFromDetailData(listingData: IProjectDetailUrlFromData) {
		return UrlService.ProjectDetail.getUrlFromProjectDetailData(listingData);
	}
	// getUrlFromChildData(listingData: IProjectChildListingUrlFromData) {
	// 	return UrlService.ProjectDetail.getUrlFromProjectChildDetailData(listingData);
	// }
}

class SchoolCatchmentUrlService implements IUrlService {
	getUrlFromSrData(listingData: IListingSrData) {
		if (
			listingData.locations &&
			listingData.locations?.length > 0 &&
			!listingData.locations[0].schoolName &&
			!listingData.locations[0].schoolNameSlug
		) {
			return UrlService.ListingSr.getUrlFromListingSrData(listingData);
		}
		return UrlService.SchoolCatchmentSr.getUrlFromSchoolCatchmentSrData(listingData);
	}
	getUrlFromDetailData(listingData: IListingDetailUrlFromData) {
		return '';
	}
}

export class UrlServiceFactory {
	static getUrlStrategy(urlType: EModuleType) {
		if (urlType === EModuleType.HOME) {
			return new ListingUrlService();
		} else if (urlType === EModuleType.PROJECT) {
			return new NewDevUrlService();
		} else if (urlType === EModuleType.SCHOOL) {
			return new SchoolCatchmentUrlService();
		} else {
			console.log('No Found URL');
		}
	}
}
