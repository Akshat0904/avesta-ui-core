import { INewDevDetailAnalyticsService } from '@newDevelopment/core/interface/newDevDetailAnalyticsService';
import { TListingAndNdDetailPageResponse } from '@newDevelopment/core/types/newDevelopmentTypes';
import { IProjectSrData } from '@realestateview/avesta-js-core';
import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import { EAppsPageType } from '@shared/types/enums';
import {
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	EAnalyticsTitleType
} from '@shared/types/matomo';

export abstract class NewDevDetailAnalyticsService implements INewDevDetailAnalyticsService {
	protected data: TListingAndNdDetailPageResponse;
	private eventCategory = EAnalyticsEventCategory.NewDevelopments;
	constructor(private analyticsService: IAnalyticsService, aData: TListingAndNdDetailPageResponse) {
		this.data = aData;
	}

	private getLocationDetails() {
		const data = this.data;

		return {
			city: data.city,
			lgaName: data.lgaName,
			postCode: data.postcode,
			state: data.state,
			suburb: data.suburbName,
			street: data.streetAddress
		};
	}

	protected abstract getAccommodationDetails(): object;

	protected abstract getId(): string;

	private getLocationAndAccommodationDetails() {
		return {
			...this.getAccommodationDetails(),
			...this.getLocationDetails()
		};
	}

	private getCommonDimensions() {
		return {
			listingId_GnafId: this.getId(),
			...this.getLocationAndAccommodationDetails()
		};
	}

	trackSelectCompare(): void {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.SelectCompare,
			'',
			'',
			EAnalyticsEventType.NdSelectCompare,
			this.getCommonDimensions()
		);
	}

	trackShareInteraction(eventName: string): void {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.Share,
			eventName,
			'',
			EAnalyticsEventType.NdShare,
			this.getCommonDimensions()
		);
	}

	trackShortListInteraction(): void {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.ShortlistProperty,
			'',
			'',
			EAnalyticsEventType.NdShortlistProperty,
			this.getCommonDimensions()
		);
	}

	trackUnShortListInteraction(): void {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.UnshortlistProperty,
			'',
			'',
			EAnalyticsEventType.NdUnshortlistProperty,
			this.getCommonDimensions()
		);
	}

	trackBreadcrumbInteraction(appliedFilters: IProjectSrData | undefined, eventName: string) {
		if (!appliedFilters || !appliedFilters.locations || appliedFilters.locations.length === 0) {
			return this.analyticsService.trackEvent(
				this.eventCategory,
				eventName,
				'',
				'',
				EAnalyticsEventType.NdClickBreadcrumb,
				{}
			);
		}

		const location = appliedFilters.locations[0];
		this.analyticsService.trackEvent(this.eventCategory, eventName, '', '', EAnalyticsEventType.NdClickBreadcrumb, {
			state: location.state,
			city: location.city,
			lgaName: location.lgaName,
			suburb: location.suburbName,
			bedroom: appliedFilters.bedrooms,
			bathroom: appliedFilters.bathrooms,
			carpark: appliedFilters.carparks,
			propertyType: appliedFilters.propertyTypes,
			postCode: location.postcode
		});
	}

	private deriveUrlPathAndTitle(pageType: EAppsPageType) {
		if (pageType === EAppsPageType.NewDevParentDetail) {
			return {
				url: '/new-developments/',
				title: EAnalyticsTitleType.NewDevParentDetailPage
			};
		}

		return {
			url: '/new-development-child/',
			title: EAnalyticsTitleType.NewDevChildDetailPage
		};
	}

	trackPageView(pageType: EAppsPageType): void {
		const { title, url } = this.deriveUrlPathAndTitle(pageType);

		this.analyticsService.trackPageView(title, url, this.getCommonDimensions());
	}

	trackLocationProfile(): void {
		this.analyticsService.trackEvent(
			EAnalyticsEventCategory.LocationProfile,
			EAnalyticsEventAction.InSearchResult,
			'',
			'',
			EAnalyticsEventType.LocationProfile,
			this.getLocationDetails()
		);
	}

	processPageViewEvents(pageType: EAppsPageType) {
		this.trackPageView(pageType);

		if (this.data.suburbProfile && this.data.suburbProfile.link) {
			this.trackLocationProfile();
		}
	}

	trackCommonEventInteraction(eventAction: EAnalyticsEventAction, eventName?: string): void {
		this.analyticsService.trackEvent(
			this.eventCategory,
			eventAction,
			eventName || '',
			'',
			EAnalyticsEventType.NdCommonAction,
			this.getCommonDimensions()
		);
	}

	trackChildEnquiryNowInteraction(childId: number): void {
		const childEnquiryData =
			this.data.properties && this.data.properties.find((property) => property.id === childId);

		if (!childEnquiryData) return;

		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.ViewEnquireNow,
			'',
			'',
			EAnalyticsEventType.NdViewEnquireNow,
			{
				listingId_GnafId: childId.toString() || this.data.projectSlug,
				...this.getLocationDetails(),
				propertyType: childEnquiryData.propertyType,
				...(childEnquiryData.bedrooms && { bedroom: childEnquiryData.bedrooms }),
				...(childEnquiryData.bathrooms && { bathroom: childEnquiryData.bathrooms }),
				...(childEnquiryData.carparks && { carpark: childEnquiryData.carparks })
			}
		);
	}

	trackSaveInspectionTimeInteraction(epochTime: number): void {
		this.analyticsService.trackEvent(
			this.eventCategory,
			EAnalyticsEventAction.SaveInspectionTime,
			'',
			'',
			EAnalyticsEventType.NdSaveInspectionTime,
			{
				...this.getCommonDimensions(),
				dateTime: epochTime
			}
		);
	}
}
