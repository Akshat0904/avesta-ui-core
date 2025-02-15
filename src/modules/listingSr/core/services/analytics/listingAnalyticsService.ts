import { IAnalyticsService } from '@shared/interfaces/analyticsService';
import { EntityTypeAnalyticsStrategyFactory } from '@shared/services/entityTypeAnalyticsStrategyFactory';
import {
	EAccommodationType,
	EAnalyticsEventAction,
	EAnalyticsEventCategory,
	EAnalyticsEventType,
	TListingCommonDimensions
} from '@shared/types/matomo';

export class ListingAnalyticsService {
	constructor(
		private analyticsService: IAnalyticsService,
		private entityTypeAnalyticsStrategyFactory: EntityTypeAnalyticsStrategyFactory
	) {}

	public getAnalyticsStrategy(aAccommodationType: EAccommodationType | undefined) {
		const accommodationType = aAccommodationType || EAccommodationType.Simple;

		return this.entityTypeAnalyticsStrategyFactory.getNewDevAnalyticsService(accommodationType);
	}

	public getAccommodationDetails(
		aAccommodationType: EAccommodationType | undefined,
		bathroom: string | number | undefined,
		bedroom: string | number | undefined,
		carParks: string | number | undefined
	) {
		const analyticsStrategy = this.getAnalyticsStrategy(aAccommodationType);

		return analyticsStrategy.getAccommodationDetails(bathroom || 0, bedroom || 0, carParks || 0);
	}

	public getListingCommonDimensions(listing: TListingCommonDimensions, aAccommodationType?: EAccommodationType) {
		const accommodationDetails = this.getAccommodationDetails(
			aAccommodationType,
			listing.bathroom,
			listing.bedroom,
			listing.carpark
		);

		return {
			agencyId: listing.agencyId,
			agentId: listing.agentId,
			lgaName: listing.lgaName,
			listingId_GnafId: listing.listingId_GnafId,
			listingType: listing.listingType,
			postCode: listing.postCode,
			propertyType: listing.propertyType,
			sa1Code: listing.sa1Code,
			state: listing.state,
			street: listing.street,
			suburb: listing.suburb,
			tierType: listing.tierType,
			city: listing.city,
			imageSource: listing.imageSource,
			isReipListing: listing.isReipListing,
			isReipAgency: listing.isReipAgency,
			...accommodationDetails
		};
	}

	addNoteTrackEvent(eventCategory: EAnalyticsEventCategory) {
		this.analyticsService.trackEvent(
			eventCategory,
			EAnalyticsEventAction.AddNote,
			'',
			'',
			EAnalyticsEventType.AddNote,
			null
		);
	}

	saveOrDeleteNoteTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		eventAction: EAnalyticsEventAction,
		message: string
	) {
		this.analyticsService.trackEvent(eventCategory, eventAction, '', '', EAnalyticsEventType.SaveOrDeleteNote, {
			message
		});
	}

	viewOrSaveCompareTrackEvent(eventCategory: EAnalyticsEventCategory, eventAction: EAnalyticsEventAction) {
		this.analyticsService.trackEvent(
			eventCategory,
			eventAction,
			'',
			'',
			EAnalyticsEventType.ViewOrSaveCompare,
			null
		);
	}

	selectCompareTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		listing: TListingCommonDimensions,
		aAccommodationType?: EAccommodationType
	) {
		const listingCommonDimensions = this.getListingCommonDimensions(listing, aAccommodationType);

		this.analyticsService.trackEvent(
			eventCategory,
			EAnalyticsEventAction.SelectCompare,
			'',
			'',
			EAnalyticsEventType.SelectCompare,
			{ ...listingCommonDimensions }
		);
	}

	shareListingTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		selectedOption: string,
		listing: TListingCommonDimensions,
		aAccommodationType?: EAccommodationType
	) {
		const listingCommonDimensions = this.getListingCommonDimensions(listing, aAccommodationType);

		this.analyticsService.trackEvent(
			eventCategory,
			EAnalyticsEventAction.Share,
			selectedOption,
			'',
			EAnalyticsEventType.Share,
			{ ...listingCommonDimensions }
		);
	}

	photocarouselOrGalleryTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		eventAction: EAnalyticsEventAction,
		listing: TListingCommonDimensions,
		aAccommodationType?: EAccommodationType
	) {
		const listingCommonDimensions = this.getListingCommonDimensions(listing, aAccommodationType);

		this.analyticsService.trackEvent(
			eventCategory,
			eventAction,
			'',
			'',
			EAnalyticsEventType.PhotocarouselOrGallery,
			{ ...listingCommonDimensions }
		);
	}

	emailAgentTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		eventAction: EAnalyticsEventAction,
		listing: TListingCommonDimensions,
		aAccommodationType?: EAccommodationType
	) {
		const listingCommonDimensions = this.getListingCommonDimensions(listing, aAccommodationType);

		this.analyticsService.trackEvent(eventCategory, eventAction, '', '', EAnalyticsEventType.EmailAgent, {
			...listingCommonDimensions
		});
	}

	shortListOrUnShortListTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		eventAction: EAnalyticsEventAction,
		listing: TListingCommonDimensions,
		aAccommodationType?: EAccommodationType
	) {
		const listingCommonDimensions = this.getListingCommonDimensions(listing, aAccommodationType);

		this.analyticsService.trackEvent(
			eventCategory,
			eventAction,
			'',
			'',
			EAnalyticsEventType.ShortListOrUnShortList,
			{
				...listingCommonDimensions
			}
		);
	}

	agentAndAgencyProfileViewTrackEvent(
		eventCategory: EAnalyticsEventCategory,
		eventAction: EAnalyticsEventAction,
		listing: TListingCommonDimensions,
		aAccommodationType?: EAccommodationType
	) {
		const listingCommonDimensions = this.getListingCommonDimensions(listing, aAccommodationType);

		this.analyticsService.trackEvent(eventCategory, eventAction, '', '', EAnalyticsEventType.AgentAgencyProfile, {
			...listingCommonDimensions
		});
	}
}
