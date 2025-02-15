import { TClickAgencyPhoneAndEmailDimensions, TClickEmailUsDimensions } from '@shared/types/matomo';

export interface IAgencyProfileAnalytics {
	trackClickAgencyPhone(matomoDetails: TClickAgencyPhoneAndEmailDimensions): void;
	trackViewEmailUs(matomoDetails: TClickAgencyPhoneAndEmailDimensions): void;
	trackClickEmailUs(matomoDetails: TClickEmailUsDimensions): void;
}
