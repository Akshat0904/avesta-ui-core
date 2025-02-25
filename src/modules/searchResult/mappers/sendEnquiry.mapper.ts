import { SendEnquiryCommand } from '@searchResult/commands/sendEnquiry.command';
import { EnquiryToAgentApiBody } from '@searchResult/types/types';

export class SendEnquiryMapper {
	static toApiData(command: SendEnquiryCommand): EnquiryToAgentApiBody {
		const { data, emailType, listingId, enquiryFrom, saleMethod, analyticsData } = command;

		return {
			listingId: Number(listingId),
			email: data.email.trim(),
			lastName: data.lastName.trim(),
			firstName: data.firstName.trim(),
			...(data.message && { message: data.message }),
			...(data.phone && { phoneNumber: data.phone }),
			emailType: emailType,
			analytics: {
				DeviceResolution: analyticsData.deviceResolution,
				FirstVisitTs: analyticsData.firstVisitTs,
				PreviousVisitTs: analyticsData.previousVisitTs,
				Url: analyticsData.url,
				UrlRef: analyticsData.urlRef,
				UserId: analyticsData.userId,
				VisitorId: analyticsData.visitorId,
				VisitCount: analyticsData.visitCount,
				IpAddress: analyticsData.ipAddress,
				UserAgent: analyticsData.userAgent
			},
			EnquiryFromPage: enquiryFrom,
			saleMethod: saleMethod,
			...(data.checkbox && this.getCheckboxData(data.checkbox))
		};
	}

	private static getCheckboxData(checkbox: string[]): Record<string, boolean> {
		return checkbox.reduce((acc, ele) => ({ ...acc, [ele]: true }), {});
	}
}
