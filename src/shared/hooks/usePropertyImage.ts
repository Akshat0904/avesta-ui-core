import {
	TImagePropertyResponse,
	TListingImageParams,
	TPropertiesWithImagesDetails,
	TPropertyImageParams
} from '../types/types';
import { TRecentlyViewedProperties } from '../types/types';
import { useServices } from './useServices';
import { useSharedService } from './useSharedService';

export const usePropertyImage = () => {
	const { propertyImageService, toasterService, listingService, storageService } = useSharedService();

	const { priceEstimatorService } = useServices();

	const updateRecentlyViewedProperties = (images: TPropertiesWithImagesDetails[]) => {
		const recentlyViewed = storageService.getItem('__view_recently_viewed');
		if (!recentlyViewed) {
			return;
		}
		const recentlyViewedProperties: TRecentlyViewedProperties[] = JSON.parse(recentlyViewed);

		const updatedProperties = recentlyViewedProperties.map((property) => {
			const matchedImage = images.find((image) => image.seoSlug === property.seoSlug);

			if (matchedImage) {
				return {
					...property,
					image: { photo: priceEstimatorService.constructImageUrl(matchedImage, 400) }
				};
			}

			return property;
		});

		listingService.storeRecentlyViewed(updatedProperties);
	};

	const isTListingImageParams = (object: any): object is TListingImageParams => {
		return 'listingId' in object;
	};

	const getPropertyImageData = (
		properties: TPropertyImageParams[] | TListingImageParams[],
		width?: number,
		height?: number
	) => {
		return {
			property: properties.map((aProperty) => {
				return {
					seoSlug: aProperty.seoSlug,
					fullAddress: aProperty.fullAddress,
					latitude: aProperty.latitude,
					longitude: aProperty.longitude,
					...(!isTListingImageParams(aProperty) && aProperty.gnafId && { gnafId: aProperty.gnafId }),
					...(isTListingImageParams(aProperty) && aProperty.listingId && { listingId: aProperty.listingId })
				};
			}),
			options: {
				excludeClImg: !properties.some((obj) => isTListingImageParams(obj) && obj?.listingId !== undefined),
				nearMapImageDimension: {
					width: width ?? undefined,
					height: height ?? undefined
				}
			}
		};
	};

	const fetchImage = async (
		properties: TPropertyImageParams[] | TListingImageParams[],
		width?: number,
		height?: number
	) => {
		try {
			const response: TImagePropertyResponse = await propertyImageService.getDynamicImage(
				getPropertyImageData(properties, width, height)
			);
			if (
				!response.success ||
				!response.data ||
				!response.data.propertiesWithImages ||
				response.data.propertiesWithImages.length === 0
			) {
				return;
			}
			updateRecentlyViewedProperties(response.data.propertiesWithImages);
			return response.data.propertiesWithImages;
		} catch (error: any) {
			toasterService.customToaster(error.message, 'error');
		}
	};

	return { fetchImage };
};
