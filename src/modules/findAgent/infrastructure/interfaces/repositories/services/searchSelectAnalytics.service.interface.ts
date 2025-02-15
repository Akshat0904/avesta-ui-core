import { TAgentSearchSelectionDimensions } from '@shared/types/matomo';

export interface FindAgentFindAgentSearchAnalyticsService {
	trackSearchSelection(matomoDetails: TAgentSearchSelectionDimensions, url?: string): void;
}
