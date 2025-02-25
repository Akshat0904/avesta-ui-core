import { AnalyticsData } from '@searchResult/types/types';

export type SendEnquiryCommand = {
	data: {
		email: string;
		lastName: string;
		firstName: string;
		message?: string;
		phone?: string;
		checkbox?: string[];
	};
	emailType: string;
	listingId: string | number;
	enquiryFrom: string;
	saleMethod: string;
	analyticsData: AnalyticsData;
};
