import { TListing, TPinListing, TSrPageScreen } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ILocation } from '@realestateview/avesta-js-core';
import {
	EAnalyticsEventCategory,
	EAnalyticsTitleType,
	TListingCommonDimensions,
	TListingSrPageCommonDimensions,
	TNdListingCommonDimensions,
	TNDSrPageCommonDimensions
} from '@shared/types/matomo';

export interface IEntityTypeAnalyticsStrategy {
	getEventCategory(): EAnalyticsEventCategory;
	deriveUrlPathAndTitle(screen: TSrPageScreen): { url: string; title: EAnalyticsTitleType };
	getPageViewCommonDimensions(
		appliedFilters: IListingSrData,
		location: ILocation[]
	): TListingSrPageCommonDimensions | TNDSrPageCommonDimensions;
	getEventTrackingCommonDimensions(
		listing: TListing | TPinListing
	): TListingCommonDimensions | TNdListingCommonDimensions;
}
