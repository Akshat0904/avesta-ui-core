import { TAddOrRemoveShortlistPropertyBodyParams } from '@shared/types/types';
import { TListing, TPinListing, TPinP360 } from '@listingSr/core/types/listingSrTypes';
import { IListingSrState } from '@listingSr/core/types/listingSrState';
import getStateManager from '../stateManagement/stateManagementFactory';

export const useListingSrShortlist = () => {
	const stateManager: IListingSrState = getStateManager();

	const listingSrResponse = stateManager.useListingSrResponse();
	const setListingSrResponse = stateManager.useSetListingSrResponse();

	const updateChildListings = (
		aListing: TListing | TPinListing,
		shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams,
		isShortListed: boolean
	) => {
		return aListing.properties?.map((property) =>
			property.id === shortlistPropertyParams.projectPropertiesId
				? { ...property, isShortListed, noteId: 0, note: '' }
				: property
		);
	};

	const isProjectShortlisted = (
		id: number,
		projectId: number | string | undefined,
		projectPropertiesId?: string | number
	) => {
		return id === projectId && !projectPropertiesId;
	};

	const isListingShortlisted = (id: number, shortListedId?: string) => {
		return id.toString() === shortListedId;
	};

	const updateListingsAndPins = (
		aListing: TListing | TPinListing,
		shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams,
		isShortListed: boolean
	) => {
		const { id } = aListing;
		const { shortlistProperty, projectId, projectPropertiesId } = shortlistPropertyParams;

		if (isListingShortlisted(id, shortlistProperty)) {
			return { ...aListing, isShortListed };
		}

		if (isProjectShortlisted(id, projectId, projectPropertiesId)) {
			return { ...aListing, isShortListed };
		}

		return {
			...aListing,
			properties: updateChildListings(aListing, shortlistPropertyParams, isShortListed)
		};
	};

	const getUpdatedListings = (
		shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams,
		isShortListed: boolean
	) => {
		return listingSrResponse.listings.map((aListing) =>
			updateListingsAndPins(aListing, shortlistPropertyParams, isShortListed)
		) as TListing[];
	};

	const getUpdatedPins = (
		shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams,
		isShortListed: boolean
	) => {
		return listingSrResponse.pins.map((aPin) =>
			updateListingsAndPins(aPin, shortlistPropertyParams, isShortListed)
		) as TPinListing[];
	};

	const getUpdatedProperties = (
		shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams,
		isShortListed: boolean
	) => {
		return listingSrResponse.p360Properties?.data.map((aProperty) =>
			aProperty.seoSlug === shortlistPropertyParams.shortlistProperty
				? { ...aProperty, isShortListed }
				: aProperty
		);
	};

	const updateShortlistStatus = (
		shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams,
		isShortListed: boolean
	) => {
		const updatedListings = getUpdatedListings(shortlistPropertyParams, isShortListed);

		const updatedProperties = getUpdatedProperties(shortlistPropertyParams, isShortListed);

		const updatedPins = getUpdatedPins(shortlistPropertyParams, isShortListed);

		if (!isShortListed) {
			updatedListings.forEach((listing) => {
				if (listing.id.toString() === listing.id.toString()) {
					listing.noteId = 0;
					listing.note = '';
				}
			});
		}

		updateData(updatedListings, updatedPins, updatedProperties);
	};

	const updateData = (updatedListings: TListing[], updatedPins: TPinListing[], updatedProperties: TPinP360[]) => {
		setListingSrResponse({
			...listingSrResponse,
			listings: updatedListings,
			p360Properties: {
				...listingSrResponse.p360Properties,
				data: updatedProperties
			},
			pins: updatedPins
		});
	};

	const removeShortlistProperty = (shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams) => {
		updateShortlistStatus(shortlistPropertyParams, false);
	};

	const addShortlistProperty = (shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams) => {
		updateShortlistStatus(shortlistPropertyParams, true);
	};

	return { removeShortlistProperty, addShortlistProperty };
};
