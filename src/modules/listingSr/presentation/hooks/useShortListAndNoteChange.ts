import { useEffect } from 'react';
import { useSubscriberInfo } from '@shared/hooks/useSubscriberInfo';
import { useSharedService } from '@shared/hooks/useSharedService';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import { TListing, TPinListing, TPinP360 } from '../../core/types/listingSrTypes';
import getStateManager from '../stateManagement/stateManagementFactory';

export const useShortListAndNoteChange = () => {
	const { listingService } = useSharedService();
	const { subscriberInfo } = useSubscriberInfo();

	const stateManager: IListingSrState = getStateManager();

	const listingSrResponse = stateManager.useListingSrResponse();
	const setListingSrResponse = stateManager.useSetListingSrResponse();

	const getSubscribersListingsAndNote = ({
		listings,
		properties,
		pins
	}: {
		listings: TListing[];
		properties: TPinP360[];
		pins: TPinListing[];
	}) => {
		if (listings && listings.length > 0) {
			listingService.updateListingsWithShortListings(listings, subscriberInfo?.shortListings?.listings || []);
			listingService.updateProjectsWithShortListings(listings, subscriberInfo?.shortListings?.projects || []);
		}

		if (properties && properties.length > 0) {
			listingService.updatePropertiesWithShortListedSlugs(
				properties,
				subscriberInfo?.shortListings?.seoSlugs || []
			);
		}

		if (pins && pins.length > 0) {
			listingService.updatePinsWithShortListedNotes(pins, subscriberInfo?.shortListings?.listings);
			listingService.updateProjectPinsWithShortListedNotes(pins, subscriberInfo?.shortListings?.projects);
		}

		return { listings, properties, pins };
	};

	useEffect(() => {
		const { listings, properties, pins } = getSubscribersListingsAndNote({
			listings: listingSrResponse.listings,
			properties: listingSrResponse.p360Properties.data,
			pins: listingSrResponse.pins
		});

		setListingSrResponse({
			...listingSrResponse,
			listings: listings,
			pins: pins,
			p360Properties: {
				total: listingSrResponse.p360Properties.total,
				data: properties
			}
		});
	}, [subscriberInfo]);
};
