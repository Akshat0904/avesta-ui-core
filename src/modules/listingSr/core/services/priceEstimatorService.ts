import { capitalizeFirstLetter, formatPrice } from '@shared/utils/utils';
import { TPropertiesWithImagesDetails, TPropertyLocationDetails } from '@shared/types/types';
import { IConfigService } from '@shared/interfaces/configService';
import { IListingSrData, UrlService } from '@realestateview/avesta-js-core';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { EPropertyImageSource } from '@shared/types/enums';
import { TPinP360 } from '../types/listingSrTypes';
import { ISrAnalyticsService } from '../interfaces/srAnalyticsService';
import { IPropertyRepository } from '../interfaces/priceEstimatorRepository';

export class PriceEstimatorService {
	constructor(
		private repo: IPropertyRepository,
		private config: IConfigService,
		private srAnalyticsService: ISrAnalyticsService,
		private storageService: ILocalStorageService
	) {}

	async getP360DetailUrl(gnafId: string) {
		return this.repo.getDetailUrl(gnafId);
	}

	setRecentSearchIntoStorage(selectedLocation: TPropertyLocationDetails) {
		this.storageService.setItem('__view_lastSelectedSearch', JSON.stringify(selectedLocation));
	}

	async handlePropertyChange(
		selectedLocation: TPropertyLocationDetails,
		searchKeyword: string,
		appliedFilters: IListingSrData
	) {
		try {
			this.srAnalyticsService.trackFilterSearchInteraction(
				appliedFilters,
				[selectedLocation],
				searchKeyword,
				selectedLocation.gnafId
			);
			if (selectedLocation.gnafId) {
				const urlData = await this.getP360DetailUrl(selectedLocation.gnafId);
				if (urlData) {
					this.setRecentSearchIntoStorage(selectedLocation);
					return urlData;
				}
			}
			const url = UrlService.PriceEstimator.getUrlFromData(selectedLocation);
			if (!url) {
				return;
			}
			this.setRecentSearchIntoStorage(selectedLocation);
			return url;
		} catch (error) {
			throw error;
		}
	}

	getPropertyHeading = (avmHigh: number, avmLow: number) => {
		if (!avmHigh && !avmLow) {
			return 'Estimate unavailable';
		}

		let avmLowNo;
		let avmHighNo;

		if (avmLow) {
			avmLowNo = `$${formatPrice(avmLow, 1)}`;
		}
		if (avmHigh) {
			avmHighNo = `$${formatPrice(avmHigh, 1)}`;
		}

		if (avmLowNo && avmHighNo) {
			return `${avmLowNo} - ${avmHighNo}`;
		}
		if (avmLowNo) return avmLowNo;
		if (avmHighNo) return avmHighNo;

		return '';
	};

	generatePropertyConfidenceText = (
		avmHigh: number,
		avmLow: number,
		avmConfidenceBand: string
	): string | undefined => {
		if (avmHigh !== 0 && avmLow !== 0) {
			const res = avmConfidenceBand.toLowerCase().split('_');
			if (res.length === 1) {
				return `${capitalizeFirstLetter(res[0])} Confidence`;
			}
			return `${capitalizeFirstLetter(res[0])} to ${capitalizeFirstLetter(res[1])} Confidence`;
		}
	};

	mergePropertiesWithImages(images: TPropertiesWithImagesDetails[], properties: TPinP360[]) {
		const updatedP360Pins = properties.map((property) => {
			const imageInfo = images.find((image) => image.seoSlug === property.seoSlug);
			if (imageInfo) {
				const { imageSource, imageUrl } = this.constructImageUrl(imageInfo, 200);
				return {
					...property,
					image: { google: imageUrl },
					imageSource: imageSource
				};
			}
			return property;
		});

		return updatedP360Pins;
	}

	constructImageUrl(images: TPropertiesWithImagesDetails, imageWidth: number) {
		if (images.image.google) {
			return {
				imageUrl: `${this.config.getAppConfig().googleApiImagePath}/${imageWidth}-w/${images.image.google}`,
				imageSource: EPropertyImageSource.GOOGLE
			};
		}
		if (images.image.nearMap) {
			return { imageUrl: images.image.nearMap, imageSource: EPropertyImageSource.NEARMAP };
		}
		return { imageUrl: '', imageSource: EPropertyImageSource.NONE };
	}
}
