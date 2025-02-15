import { IProjectSrData } from '@realestateview/avesta-js-core';
import { EAppsPageType } from '@shared/types/enums';
import { EAnalyticsEventAction } from '@shared/types/matomo';

export interface INewDevDetailAnalyticsService {
	trackSelectCompare(): void;
	trackShareInteraction(eventName: string): void;
	trackShortListInteraction(): void;
	trackUnShortListInteraction(): void;
	trackBreadcrumbInteraction(appliedFilters: IProjectSrData | undefined, eventName: string): void;
	processPageViewEvents(pageType: EAppsPageType): void;
	trackCommonEventInteraction(eventAction: EAnalyticsEventAction, eventName?: string): void;
	trackChildEnquiryNowInteraction(childId: number): void;
	trackSaveInspectionTimeInteraction(epochTime: number): void;
}
