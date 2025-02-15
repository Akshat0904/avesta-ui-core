import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	EAnalyticsTitleType,
	TTrackEventMap,
	TTrackPageViewMap
} from '../types/matomo';

export interface IAnalyticsService {
	trackEvent<K extends EAnalyticsEventType>(
		eventCategory: string | EAnalyticsEventCategory,
		eventAction: string | EAnalyticsEventAction,
		eventName: string,
		eventValue: string,
		eventType: K,
		args: TTrackEventMap[K],
		url?: string
	): void;
	trackPageView<K extends EAnalyticsTitleType>(
		title: EAnalyticsTitleType,
		url: string,
		args: TTrackPageViewMap[K]
	): void;

	outlinkTrackEvent(eventName: string, eventValue: string, url: string): void;
}
