import { TRecentlyViewedListingDetailBodyParams, TRecentlyViewedP360BodyParams } from '@shared/types/types';
import { TPinListing, TPinP360 } from '@listingSr/core/types/listingSrTypes';
import { useSharedService } from './useSharedService';
import { EListingEntityType } from '@realestateview/avesta-js-core';

export const useRecentlyViewedProperties = () => {
	const { listingService, subscriberService } = useSharedService();

	const addRecentlyViewedProperty = async (aPropertyRecord: (TPinListing | TPinP360 | undefined)[]) => {
		if (!subscriberService.isLoggedIn()) {
			listingService.addRecentlyViewPropertyToLocalStorage(aPropertyRecord);
			return;
		}

		const aBodyParam: (TRecentlyViewedP360BodyParams | TRecentlyViewedListingDetailBodyParams)[] = [];

		for (let i = 0; i < aPropertyRecord.length; i++) {
			const property: TPinListing | TPinP360 | undefined = aPropertyRecord[i];
			if (!property) {
				return;
			}
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

			try {
				const response = await subscriberService.addPropertyToRecentlyViewed(aBodyParam);
				return response?.success;
			} catch (error) {
				return error;
			}
		}
	};

	return { addRecentlyViewedProperty };
};
