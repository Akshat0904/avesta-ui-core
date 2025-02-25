import { TP360ListingDetailLink } from '../types/listingSrTypes';

export interface IPropertyRepository {
	getDetailUrl: (gnafId: string) => Promise<string>;
}
