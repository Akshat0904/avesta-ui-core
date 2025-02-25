import { EAnalyticsEventType, TTrackEventMap } from '@shared/types/matomo';

export interface IEventStrategyService {
	handleEvent<K extends EAnalyticsEventType>(
		eventCategory: string,
		eventAction: string,
		eventName: string,
		eventValue: string,
		eventType: EAnalyticsEventType,
		args: TTrackEventMap[K],
		url?: string
	): void;
}
