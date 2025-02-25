import { IListingSrData } from '@realestateview/avesta-js-core';
import { SrFilter } from '@searchResult/types/types';
import { removeObjectKeys } from '@shared/utils/utils';

export class UrlMapper {
	static toUrlData(appliedFilters: IListingSrData): SrFilter {
		return removeObjectKeys(appliedFilters, ['zoom', 'size']);
	}

	static toAppliedFilterUrlData(appliedFilters: SrFilter) {
		return removeObjectKeys(appliedFilters, ['zoom', 'size', 'pageType']);
	}
}
