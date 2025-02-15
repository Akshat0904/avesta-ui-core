import { TListing, TPinListing } from '@listingSr/core/types/listingSrTypes';
import { UpdatedListingQuery } from '@searchResult/useCases/shortlistProperty/shortlistProperty.type';

export class ShortlistMapper {
	static getUpdatedListing(query: UpdatedListingQuery): TListing[] {
		const { listingSrResponse, projectId, projectPropertiesId, shortlistProperty, isShortListed } = query;
		return listingSrResponse.listings.map((listing) => {
			if (this.isListingShortlisted(listing.id, shortlistProperty)) {
				return { ...listing, isShortListed: isShortListed };
			}

			if (this.isProjectShortlisted(listing.id, projectId, projectPropertiesId)) {
				return { ...listing, isShortListed: isShortListed };
			}

			return {
				...listing,
				properties: this.updateChildListings(listing, isShortListed, projectPropertiesId)
			};
		});
	}

	static getUpdatedPins(query: UpdatedListingQuery): TPinListing[] {
		const { listingSrResponse, projectId, projectPropertiesId, shortlistProperty, isShortListed } = query;
		return listingSrResponse.pins.map((pin) => {
			if (this.isListingShortlisted(pin.id, shortlistProperty)) {
				return { ...pin, isShortListed: isShortListed };
			}

			if (this.isProjectShortlisted(pin.id, projectId, projectPropertiesId)) {
				return { ...pin, isShortListed: isShortListed };
			}

			return {
				...pin,
				properties: this.updateChildListings(pin, isShortListed, projectPropertiesId)
			};
		});
	}

	static getUpdatedP360Properties(query: UpdatedListingQuery) {
		const { listingSrResponse, shortlistProperty, isShortListed } = query;
		return listingSrResponse.p360Properties?.data.map((aProperty) =>
			aProperty.seoSlug === shortlistProperty ? { ...aProperty, isShortListed: isShortListed } : aProperty
		);
	}

	private static isListingShortlisted(id: number, shortListedId?: string) {
		return id.toString() === shortListedId;
	}

	private static isProjectShortlisted = (
		id: number,
		projectId: number | string | undefined,
		projectPropertiesId?: string | number
	) => {
		return id === projectId && !projectPropertiesId;
	};

	private static updateChildListings = (
		aListing: TListing | TPinListing,
		isShortListed: boolean,
		projectPropertiesId?: number | string
	) => {
		return aListing.properties?.map((property) =>
			property.id === projectPropertiesId
				? { ...property, isShortListed: isShortListed, noteId: 0, note: '' }
				: property
		);
	};
}
