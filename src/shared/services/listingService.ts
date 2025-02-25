import {
	CommonHelpers,
	EListingStatus,
	ESaleMethod,
	IListingSrData,
	ILocation,
	UrlService
} from '@realestateview/avesta-js-core';
import {
	TCompareProperty,
	TListingSrLocations,
	TLocationSearchResponse,
	TNoteDetails,
	TPropertyLocationDetails,
	TRecentlyViewedLocal,
	TRecentlyViewedProperties,
	TStreetDetails
} from '@shared/types/types';
import { IListingRepository } from '@shared/interfaces/listingRepository';
import {
	TFilterCountDetails,
	TItems,
	TListing,
	TListingSrPageResponse,
	TLocationRecord,
	TPinListing,
	TPinP360,
	TProperties,
	TStreetRecord
} from '@listingSr/core/types/listingSrTypes';
import {
	getFormattedDate,
	getListingFullAddress,
	getPropertyFullAddress,
	getPropertyPriceText
} from '@listingSr/presentation/utils/utils';
import { ILocalStorageService } from '../interfaces/localStorageService';
import { EBadgeColors, EListingPageType, EListingRank, ELocationTypes } from '../types/enums';
import { IConfigService } from '../interfaces/configService';
import { capitalizeEachWord } from '../utils/utils';
export class ListingService {
	constructor(
		private repo: IListingRepository,
		private storageService: ILocalStorageService,
		private configService: IConfigService
	) {}

	async getListingsCount(filterDetails: IListingSrData): Promise<TFilterCountDetails> {
		return this.repo.getListingsCount(filterDetails);
	}

	formatLocationForSEO = (locations: TLocationRecord[], isToRevert: boolean) => {
		if (!locations || locations.length === 0) {
			return '';
		}
		const suburbName = locations[0].suburbName || '';
		const state = locations[0].state.toUpperCase() || '';
		const postcode = locations[0].postcode || '';
		const city = locations[0].city || '';
		const lgaName = locations[0].lgaName || '';
		const locationType = locations[0].locationType || ELocationTypes.state;

		const revertName = isToRevert ? `${postcode}, ${state}` : `${state} ${postcode}`;
		if (locationType === ELocationTypes.state) {
			return this.retrieveFullStateName(state);
		} else if (locationType === ELocationTypes.suburb) {
			return `${capitalizeEachWord(suburbName.toLowerCase())}, ${revertName}`;
		} else if (locationType === ELocationTypes.city) {
			return `${city} City, ${state}`;
		}
		return `${lgaName}, ${state}`;
	};

	retrieveFullStateName(state: string) {
		switch (state.toLowerCase()) {
			case 'vic':
				return 'Victoria';
			case 'act':
				return 'Australian Capital Territory';
			case 'nsw':
				return 'New South Wales';
			case 'nt':
				return 'Northern Territory';
			case 'qld':
				return 'Queensland';
			case 'sa':
				return 'South Australia';
			case 'tas':
				return 'Tasmania';
			case 'wa':
				return 'Western Australia';
			default:
				return 'Australia';
		}
	}

	checkLocationsInUrlData = (urlData: TListingSrLocations) => {
		if (urlData.locations && urlData.locations.length > 0) {
			return true;
		}
		return false;
	};

	updatePropertiesWithRecentlyView(data: TListingSrPageResponse) {
		let updatedPins = data.pins;
		let updatedP360Pins = data.p360Properties.data;

		const recentlyViewed = this.storageService.getItem('__view_recently_viewed');
		if (!recentlyViewed) {
			return data;
		}
		const parsedRecentlyViewed = JSON.parse(recentlyViewed);
		if (data.pins) {
			updatedPins = this.addRecentlyViewedFlagToListings(parsedRecentlyViewed, data.pins);
		}
		if (data.p360Properties) {
			updatedP360Pins = this.addRecentlyViewedFlagToP360Properties(
				parsedRecentlyViewed,
				data.p360Properties.data
			);
		}
		return {
			...data,
			pins: updatedPins,
			p360Properties: { data: updatedP360Pins, total: data.p360Properties.total }
		};
	}

	private addRecentlyViewedFlagToListings(
		recentlyViewedProperties: TRecentlyViewedProperties[],
		pins: TPinListing[]
	) {
		const updatedPins = pins.map((property: TPinListing) => {
			if (
				recentlyViewedProperties.some(
					(recentProperty: TRecentlyViewedProperties) => recentProperty.id === property.id
				)
			) {
				return { ...property, isRecentlyViewed: true };
			}
			return property;
		});
		return updatedPins;
	}

	private addRecentlyViewedFlagToP360Properties(
		recentlyViewedProperties: TRecentlyViewedProperties[],
		p360Pins: TPinP360[]
	) {
		const updatedPins = p360Pins.map((property: TPinP360) => {
			if (
				recentlyViewedProperties.some(
					(recentProperty: TRecentlyViewedProperties) => recentProperty.seoSlug === property.seoSlug
				)
			) {
				return { ...property, isRecentlyViewed: true };
			}
			return property;
		});
		return updatedPins;
	}

	updateTimeStampForExistingProperty(recentlyViewed: TRecentlyViewedLocal[], isViewedPropertyIndex: number) {
		const viewedObject = recentlyViewed[isViewedPropertyIndex];
		viewedObject.timeStamp = Number(new Date());
		recentlyViewed.splice(isViewedPropertyIndex, 1);
		recentlyViewed.unshift(viewedObject);
		this.storageService.setItem('__view_recently_viewed', JSON.stringify(recentlyViewed));
	}

	storeRecentlyViewed(newProperty: any) {
		this.storageService.setItem('__view_recently_viewed', JSON.stringify(newProperty));
	}

	transformListingProperty(aPropertyRecord: TPinListing) {
		return {
			...aPropertyRecord,
			timeStamp: Number(new Date())
		};
	}

	async updateLocalStorage(
		isListing: boolean,
		propertyIndex = -1,
		aPropertyRecord: any,
		recentlyViewedLocalStorage: TRecentlyViewedProperties[]
	) {
		if (propertyIndex === -1) {
			const newProperty = isListing
				? [this.transformListingProperty(aPropertyRecord), ...recentlyViewedLocalStorage]
				: [await this.transformP360Property(aPropertyRecord), ...recentlyViewedLocalStorage];
			this.storeRecentlyViewed(newProperty);
		} else {
			this.updateTimeStampForExistingProperty(recentlyViewedLocalStorage, propertyIndex);
		}
	}

	async transformP360Property(aPropertyRecord: TPinP360) {
		const imageUrl = this.getPropertyImage(aPropertyRecord, '200-min');
		return {
			...aPropertyRecord,
			propertyId: aPropertyRecord.gnafId,
			contractPriceText: getPropertyPriceText(aPropertyRecord),
			fullAddress: getPropertyFullAddress(aPropertyRecord),
			image: {
				google: '',
				photo: imageUrl || '',
				coreLogic: ''
			},
			p360DetailLink: UrlService.PriceEstimator.getUrlFromData({
				streetAddress: aPropertyRecord.streetAddress,
				suburbName: aPropertyRecord.suburbName,
				postcode: aPropertyRecord.postcode,
				state: aPropertyRecord.state.toLowerCase()
			}),
			AvmEstimatedPrice: {
				Maximum: aPropertyRecord.avmHigh,
				Minimum: aPropertyRecord.avmLow,
				Confidence: aPropertyRecord.avmConfidenceBand
			}
		};
	}

	async addRecentlyViewPropertyToLocalStorage(properties: any) {
		const data = this.storageService.getItem('__view_recently_viewed');
		const recentlyViewedLocalStorage: TRecentlyViewedProperties[] = JSON.parse(data as string) || [];
		for (let i = 0; i < properties.length; i++) {
			if (properties[i].isListing) {
				const isViewedPropertyIndex = recentlyViewedLocalStorage.findIndex(
					(storedProperty: any) => storedProperty.id === properties[i].id
				);

				await this.updateLocalStorage(true, isViewedPropertyIndex, properties[i], recentlyViewedLocalStorage);
			} else {
				const isViewedPropertyIndex = recentlyViewedLocalStorage.findIndex(
					(storedProperty: any) => storedProperty.seoSlug === properties[i].seoSlug
				);
				await this.updateLocalStorage(false, isViewedPropertyIndex, properties[i], recentlyViewedLocalStorage);
			}
		}
	}
	private getPropertyImage(property: TPinP360, width: string) {
		if (property.image.photo) {
			return `${this.configService.getAppConfig().imagePath}/listing/${property.seoSlug}/${width}/${
				property.image.photo.split('/')[2]
			}`;
		} else if (property.image.coreLogic) {
			return `${this.configService.getAppConfig().imagePath}/pe/${property.seoSlug}/${width}/${
				property.image.coreLogic
			}`;
		}
		return '';
	}

	private getStatus = (status: string, saleMethod: ESaleMethod) => {
		switch (status) {
			case 'Sold':
				return ESaleMethod.sold;
			case 'On Market':
				return saleMethod;
			case 'Under Offer':
				return saleMethod;
			case 'Estimate':
				return 'Unlisted';
			default:
				return saleMethod;
		}
	};

	getBadgeTextAndColor = (saleMethod: ESaleMethod, status: string) => {
		const pageType = this.getStatus(status, saleMethod);
		switch (pageType) {
			case ESaleMethod.sold:
				return {
					text: 'Sold',
					color: EBadgeColors.Primary
				};
			case ESaleMethod.lease:
				return {
					text: 'Rent',
					color: EBadgeColors.Primary
				};
			case 'Unlisted':
				return {
					text: 'Unlisted',
					color: EBadgeColors.Dull
				};
			default:
				return {
					text: 'Buy',
					color: EBadgeColors.Primary
				};
		}
	};

	getLocationId(listingSrResponse: TListingSrPageResponse) {
		const { locationESRecords, streetESRecords, schoolInfo } = listingSrResponse;
		if (!locationESRecords || locationESRecords.length === 0 || streetESRecords) {
			return;
		}
		let ids: number[] = [];

		for (let i = 0; i < locationESRecords.length; i++) {
			if (locationESRecords[i].locationType !== 'suburb') {
				return;
			}
			if (schoolInfo && schoolInfo.length > 0) {
				return [schoolInfo[i].id];
			}
			ids.push(locationESRecords[i].locationId);
		}
		return ids;
	}

	getListingAndPropertiesForComparison(compareProperties: TCompareProperty[]) {
		const listings: number[] = [];
		const properties: string[] = [];
		const projectAndPropertyIds: { projectId: number; projectPropertiesId: number }[] = [];

		for (const property of compareProperties) {
			if (property.projectProfileId) {
				projectAndPropertyIds.push({
					projectId: property.projectProfileId as number,
					projectPropertiesId: property.id as number
				});
			} else if (typeof property.id === 'number') {
				listings.push(property.id);
			} else if (typeof property.id === 'string') {
				properties.push(property.id);
			}
		}

		return {
			...(listings.length > 0 && { listings }),
			...(properties.length > 0 && { properties }),
			...(projectAndPropertyIds.length > 0 && { projectAndPropertyIds })
		};
	}

	isPropertyExist(compareProperties: TCompareProperty[], aDetails: TCompareProperty) {
		return compareProperties.find((aProperty) => aProperty.id.toString() === aDetails.id.toString());
	}

	compareLimitExhausted(compareProperties: TCompareProperty[]) {
		if (compareProperties && compareProperties.length >= 10) {
			return true;
		}
		return false;
	}

	getCompareGroupErrorMessage(selected: string) {
		const regex = /^[a-zA-Z0-9\s]*$/;
		const selectedText = selected.trim();
		if (!selectedText) {
			return 'Group Name is required';
		}
		if (selectedText.length < 2) {
			return 'Group Name must be at least 2 characters long';
		}
		if (selectedText.length > 40) {
			return 'Group Name must not be more than 40 characters';
		}
		if (!regex.test(selectedText)) {
			return 'Special characters are not allowed';
		}
		return '';
	}

	updatePinsWithShortListedNotes = (pins: TPinListing[], shortListings: TNoteDetails[] | undefined) => {
		if (!shortListings || shortListings.length === 0) {
			return;
		}

		shortListings.forEach((shortListing: TNoteDetails) => {
			pins.forEach((pin: TPinListing) => {
				if (shortListing.id === pin.id) {
					pin.isShortListed = true;
					if (shortListing.note) {
						pin.note = shortListing.note;
						pin.noteId = shortListing.subscriberShortlistListingId;
					}
				}
			});
		});
	};

	updateProjectPinsWithShortListedNotes = (pins: TPinListing[], shortListings: TNoteDetails[] | undefined) => {
		if (!shortListings || shortListings.length === 0) {
			return;
		}

		shortListings.forEach((shortListing: TNoteDetails) => {
			pins.forEach((pin: TPinListing) => {
				if (shortListing.projectId === pin.id && !shortListing.projectPropertiesId) {
					pin.isShortListed = true;
					if (shortListing.note) {
						pin.note = shortListing.note;
						pin.noteId = shortListing.subscriberShortlistListingId;
					}
				}
			});
		});
	};

	updatePropertiesWithShortListedSlugs = (properties: TPinP360[], seoSlugs: string[]) => {
		if (!seoSlugs || seoSlugs.length === 0) {
			return;
		}

		seoSlugs.forEach((seoSlug: any) => {
			properties.forEach((property) => {
				if (seoSlug === property.seoSlug) {
					property.isShortListed = true;
				}
			});
		});
	};

	updateListingsWithShortListings = (listings: TListing[], shortListings: TNoteDetails[]) => {
		shortListings.forEach((shortListing: TNoteDetails) => {
			listings.forEach((listing: TListing) => {
				if (shortListing.id === listing.id) {
					listing.isShortListed = true;
					if (shortListing.note) {
						listing.note = shortListing.note;
						listing.noteId = shortListing.subscriberShortlistListingId;
					}
				}
			});
		});
	};

	updateProjectsWithShortListings = (listings: TListing[], shortListings: TNoteDetails[]) => {
		shortListings.forEach((shortListing: TNoteDetails) => {
			listings.forEach((listing: TListing) => {
				if (shortListing.projectId === listing.id && !shortListing.projectPropertiesId) {
					this.updateListingWithShortListing(listing, shortListing);
				}
				listing.properties?.forEach((property) => {
					if (shortListing.projectPropertiesId === property.id) {
						this.updatePropertyWithShortListing(property, shortListing);
					}
				});
			});
		});
	};

	updateListingWithShortListing = (listing: TListing, shortListing: TNoteDetails) => {
		listing.isShortListed = true;
		if (shortListing.note) {
			listing.note = shortListing.note;
			listing.noteId = shortListing.subscriberShortlistListingId;
		}
	};

	updatePropertyWithShortListing = (property: TProperties, shortListing: TNoteDetails) => {
		property.isShortListed = true;
		if (shortListing.note) {
			property.note = shortListing.note;
			property.noteId = shortListing.subscriberShortlistListingId;
		}
	};

	getListingTypeBySaleMethod(listingTypes: ESaleMethod[]) {
		const listingType: EListingPageType[] = [];

		if (listingTypes.includes(ESaleMethod.sale)) {
			listingType.push(EListingPageType.buy);
		}
		if (listingTypes.includes(ESaleMethod.lease)) {
			listingType.push(EListingPageType.rent);
		}
		if (listingTypes.includes(ESaleMethod.sold)) {
			listingType.push(EListingPageType.sold);
		}
		return listingType;
	}

	getListingTypeByStatus(status: EListingStatus, saleMethod: ESaleMethod) {
		if (status.toLowerCase() === EListingStatus.sold.toLowerCase()) {
			return [EListingPageType.sold];
		}
		if (saleMethod.toLowerCase() === ESaleMethod.lease.toLowerCase()) {
			return [EListingPageType.rent];
		}
		return [EListingPageType.buy];
	}

	shouldSkipFilterCountFetch(
		selectedFilters: IListingSrData,
		selectedLocation?: TItems<TLocationSearchResponse | TPropertyLocationDetails | TStreetDetails>
	) {
		if (!this.checkIsBBoxExist(selectedFilters) && !this.checkLocationsInUrlData(selectedFilters)) {
			return true;
		}

		return selectedLocation?.groupId === 'property';
	}

	checkIsBBoxExist = (urlData: IListingSrData) => {
		if (
			urlData.topLeftLatitude &&
			urlData.topLeftLongitude &&
			urlData.bottomRightLatitude &&
			urlData.bottomRightLongitude
		) {
			return true;
		}
		return false;
	};

	getTierTypeByRank(rank: EListingRank) {
		if (!rank) {
			return '';
		}
		switch (rank) {
			case EListingRank.Basic:
				return 'FREEMIUM';
			case EListingRank.Feature:
				return 'FEATURED';

			default:
				return rank.toUpperCase();
		}
	}

	getComparePropertyDataFromListing = (listing: TListing): TCompareProperty => {
		return {
			id: listing.id || '',
			...(listing.images &&
				listing.images.length > 0 && {
					imageUrl: `${this.configService.getAppConfig().imagePath}/listing/${listing.imageUrlSlug}/150-w/${
						listing.images[0].url.split('/')[2]
					}`
				}),
			priceText:
				listing.status === EListingStatus.comingSoon ? EListingStatus.comingSoon : listing.priceText || '',
			address: getListingFullAddress(listing),
			auctionDate: listing.auctionAt ? getFormattedDate(listing.auctionAt) : '-',
			inspectionDate:
				(listing.inspections[0]?.startAt && getFormattedDate(listing?.inspections[0]?.startAt?.toString())) ||
				'-',
			propertyType: listing.primaryPropertyType || '-',
			bedrooms: listing.bedrooms,
			bathroom: listing.bathrooms,
			carParks: listing.carparks,
			land: {
				landSize: listing.landSize || 0,
				landSizeSystem: listing.landSizeSystem
			},
			saleMethod: listing.saleMethod,
			status: listing.status,
			url: listing.listingDetailLink,
			externalImageUrl: true,
			imageUrlSlug: listing.imageUrlSlug
		};
	};

	getChildComparePropertyDataFromListing = (listing: TProperties): TCompareProperty => {
		const address = CommonHelpers.getFullAddress({
			streetName: listing.streetAddress || '',
			isStreetHidden: listing.isStreetHidden,
			postcode: listing.postcode,
			state: listing.state,
			suburbName: listing.suburbName,
			streetNumber: listing.streetNumber,
			...(!listing.isUnitNumberHidden && { unitNumber: listing.unitNumber })
		});
		return {
			id: listing.id || '',
			priceText: listing.priceText || '',
			address,
			auctionDate: '-',
			inspectionDate:
				(listing.inspections?.[0]?.startAt && getFormattedDate(listing?.inspections[0]?.startAt?.toString())) ||
				'-',
			...(listing.heroImageUrl && {
				imageUrl: `${this.configService.getAppConfig().imagePath}/project-profile/${
					listing.imageUrlSlug
				}/150-w/${listing.heroImageUrl.split('/')[1]}`
			}),
			propertyType: listing.propertyType || '-',
			land: {
				landSize: listing.landSize || 0,
				landSizeSystem: listing.landSizeSystem
			},
			bedrooms: listing.bedrooms,
			bathroom: listing.bathrooms,
			carParks: listing.carparks,
			projectProfileId: listing.listingId,
			imageUrlSlug: listing.imageUrlSlug,
			externalImageUrl: true,
			url: listing.listingDetailLink
		};
	};

	private getLocationData(locationRecord: TLocationRecord[]) {
		return locationRecord.map((location) => {
			return {
				state: location.state.toUpperCase(),
				city: capitalizeEachWord(location.city || ''),
				lgaName: capitalizeEachWord(location.lgaName || ''),
				suburbName: capitalizeEachWord(location.suburbName || ''),
				postcode: capitalizeEachWord(location.postcode || '')
			};
		});
	}

	private getStreetData(streetRecord: TStreetRecord[]) {
		return streetRecord.map((location) => {
			return {
				state: location.state.toUpperCase(),
				streetName: capitalizeEachWord(location.streetName),
				suburbName: capitalizeEachWord(location.suburbName),
				postcode: capitalizeEachWord(location.postcode)
			};
		});
	}

	getLocation = (
		locationESRecords: TLocationRecord[] | undefined,
		streetESRecords: TStreetRecord[] | undefined
	): ILocation[] => {
		if (streetESRecords && streetESRecords.length > 0) {
			return this.getStreetData(streetESRecords);
		}

		if (locationESRecords && locationESRecords.length > 0) {
			return this.getLocationData(locationESRecords);
		}

		return [];
	};
}
