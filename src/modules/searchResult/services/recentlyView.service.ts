import { ListingSrPageResponse, PinListing, PinP360 } from '@searchResult/types/listingSrResponse';
import { ListingSrResponse } from '@searchResult/types/types';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { SubscriberService } from '@shared/services/subscriberService';
import { TRecentlyViewedLocal, TRecentlyViewedProperties } from '@shared/types/types';
import { IConfigService } from '@shared/interfaces/configService';
import { EListingEntityType, UrlService } from '@realestateview/avesta-js-core';
import { TRecentlyViewedListingDetailBodyParams, TRecentlyViewedP360BodyParams } from '@shared/types/types';
import { getPropertyFullAddress, getPropertyPriceText } from '@searchResult/shared/utils';

export class RecentlyViewService {
	constructor(
		private subscriberService: SubscriberService,
		private storageService: ILocalStorageService,
		private configService: IConfigService
	) {}

	handleRecentlyViewedUpdates(listingResponse: ListingSrResponse): ListingSrResponse {
		let updatedResponse = listingResponse.data;
		if (!this.subscriberService.isLoggedIn()) {
			const recentlyViewedProperties = this.storageService.getItem('__view_recently_viewed');
			if (!recentlyViewedProperties) {
				return { success: listingResponse.success, data: updatedResponse };
			} else {
				updatedResponse = this.updateRecentlyViewedPropertyWithLocalStorage(listingResponse.data);
			}
		}
		return { success: listingResponse.success, data: updatedResponse };
	}

	async handleMarkerRecentViewUpdate(
		listingSrResponse: ListingSrPageResponse,
		propertyDetails?: (PinListing | PinP360 | undefined)[]
	) {
		if (!this.subscriberService.isLoggedIn()) {
			if (propertyDetails && propertyDetails.length > 0) {
				this.addRecentlyViewPropertyToLocalStorage(propertyDetails);
			}
			return this.updateRecentlyViewedPropertyWithLocalStorage(listingSrResponse);
		} else {
			if (propertyDetails && propertyDetails.length > 0) {
				const response = await this.addRecentlyViewedProperty(propertyDetails);
				if (!response) {
					return;
				}
				return this.updateRecentlyViewedPropertyWhenLogin(listingSrResponse, propertyDetails);
			}
		}
		return listingSrResponse;
	}

	private updateRecentlyViewedPropertyWithLocalStorage(
		listingResponse: ListingSrPageResponse
	): ListingSrPageResponse {
		let updatedPins = listingResponse.pins;
		let updatedP360Pins = listingResponse.p360Properties.data;

		const recentlyViewed = this.storageService.getItem('__view_recently_viewed');

		if (!recentlyViewed) {
			return listingResponse;
		}

		const parsedRecentlyViewed = recentlyViewed ? JSON.parse(recentlyViewed) : null;

		if (listingResponse.pins) {
			updatedPins = this.addRecentlyViewedFlagToListings(parsedRecentlyViewed, listingResponse.pins);
		}

		if (listingResponse.p360Properties) {
			updatedP360Pins = this.addRecentlyViewedFlagToP360Properties(
				parsedRecentlyViewed,
				listingResponse.p360Properties.data
			);
		}

		return {
			...listingResponse,
			pins: updatedPins,
			p360Properties: {
				data: updatedP360Pins,
				total: listingResponse.p360Properties.total
			}
		};
	}

	private async updateRecentlyViewedPropertyWhenLogin(
		listingResponse: ListingSrPageResponse,
		propertyDetails: (PinListing | PinP360 | undefined)[]
	) {
		if (propertyDetails.length > 0) {
			const updatedPins = [...listingResponse.pins];
			const updatedP360Pins = [...listingResponse.p360Properties.data];

			updatedPins.forEach((pin) => {
				if (
					pin.isListing &&
					propertyDetails.some((aProperty) => aProperty?.isListing && aProperty.id === pin.id)
				) {
					pin.isRecentlyViewed = true;
				}
			});

			updatedP360Pins.forEach((pin) => {
				if (
					!pin.isListing &&
					propertyDetails.some(
						(aProperty) => !aProperty?.isListing && aProperty && aProperty.seoSlug === pin.seoSlug
					)
				) {
					pin.isRecentlyViewed = true;
				}
			});

			return {
				...listingResponse,
				pins: updatedPins,
				p360Properties: {
					data: updatedP360Pins,
					total: listingResponse.p360Properties.total
				}
			};
		}
	}

	private async addRecentlyViewedProperty(propertyRecord: (PinListing | PinP360 | undefined)[]) {
		const aBodyParam: (TRecentlyViewedP360BodyParams | TRecentlyViewedListingDetailBodyParams)[] = [];

		for (const property of propertyRecord) {
			if (!property) continue;

			if ('id' in property) {
				aBodyParam.push({
					timestamp: Number(Date.now()),
					...(property.id &&
						property.entityType !== EListingEntityType.project && { listingId: property.id }),
					...(property.id && property.entityType === EListingEntityType.project && { projectId: property.id })
				});
			} else if ('seoSlug' in property) {
				aBodyParam.push({
					timestamp: Number(Date.now()),
					seoSlug: property.seoSlug
				});
			}
		}

		try {
			const response = await this.subscriberService.addPropertyToRecentlyViewed(aBodyParam);
			return response?.success;
		} catch (error) {
			return error;
		}
	}

	private addRecentlyViewedFlagToListings(recentlyViewedProperties: TRecentlyViewedProperties[], pins: PinListing[]) {
		const updatedPins = pins.map((property: PinListing) => {
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
		p360Pins: PinP360[]
	) {
		const updatedPins = p360Pins.map((property: PinP360) => {
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

	private addRecentlyViewPropertyToLocalStorage(properties: any) {
		const data = this.storageService.getItem('__view_recently_viewed');
		const recentlyViewedLocalStorage: TRecentlyViewedProperties[] = JSON.parse(data as string) || [];
		for (let i = 0; i < properties.length; i++) {
			if (properties[i].isListing) {
				const isViewedPropertyIndex = recentlyViewedLocalStorage.findIndex(
					(storedProperty: any) => storedProperty.id === properties[i].id
				);

				this.updateLocalStorage(true, isViewedPropertyIndex, properties[i], recentlyViewedLocalStorage);
			} else {
				const isViewedPropertyIndex = recentlyViewedLocalStorage.findIndex(
					(storedProperty: any) => storedProperty.seoSlug === properties[i].seoSlug
				);
				this.updateLocalStorage(false, isViewedPropertyIndex, properties[i], recentlyViewedLocalStorage);
			}
		}
	}

	private updateLocalStorage(
		isListing: boolean,
		propertyIndex = -1,
		property: any,
		recentlyViewedLocalStorage: TRecentlyViewedProperties[]
	) {
		if (propertyIndex === -1) {
			const notExistingProperty = isListing
				? [this.transformListingProperty(property), ...recentlyViewedLocalStorage]
				: [this.transformP360Property(property), ...recentlyViewedLocalStorage];
			this.storeRecentlyViewed(notExistingProperty);
		} else {
			this.updateTimeStampForExistingProperty(recentlyViewedLocalStorage, propertyIndex);
		}
	}

	private storeRecentlyViewed(property: any) {
		this.storageService.setItem('__view_recently_viewed', JSON.stringify(property));
	}

	private updateTimeStampForExistingProperty(recentlyViewed: TRecentlyViewedLocal[], isViewedPropertyIndex: number) {
		const viewedObject = recentlyViewed[isViewedPropertyIndex];
		viewedObject.timeStamp = Number(new Date());
		recentlyViewed.splice(isViewedPropertyIndex, 1);
		recentlyViewed.unshift(viewedObject);
		this.storageService.setItem('__view_recently_viewed', JSON.stringify(recentlyViewed));
	}

	private transformListingProperty(aPropertyRecord: PinListing) {
		return {
			...aPropertyRecord,
			timeStamp: Number(new Date())
		};
	}

	private transformP360Property(aPropertyRecord: PinP360) {
		const imageUrl = this.getP360PropertyImage(aPropertyRecord, '200-min');
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

	private getP360PropertyImage(property: PinP360, width: string) {
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
}
