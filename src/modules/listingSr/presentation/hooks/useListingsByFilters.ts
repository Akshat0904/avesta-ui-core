import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { IListingSrData } from '@realestateview/avesta-js-core';
import { TLocationSearchResponse, TPropertyLocationDetails, TStreetDetails } from '@shared/types/types';
import { EToastMsg } from '@shared/types/enums';
import { debounceDelayKeys } from '@shared/constants/constants';
import { TItems } from '../../core/types/listingSrTypes';
import { useSharedService } from '@shared/hooks/useSharedService';

export const useListingsByFilters = (
	initialFilters: IListingSrData,
	selectedLocation?: TItems<TLocationSearchResponse | TPropertyLocationDetails | TStreetDetails>
) => {
	const [selectedFilters, setToSelectedFilters] = useState<IListingSrData>(initialFilters);

	const { listingService, toasterService } = useSharedService();

	const [isLoading, setIsLoading] = useState(false);
	const [searchBtnText, setSearchBtnText] = useState('');

	const prepareFilterCountRequestData = (selectedFilters: IListingSrData) => {
		if (selectedFilters.locations && selectedFilters.locations.length !== 0) {
			const { page, sort, ...rest } = selectedFilters;
			return {
				...rest,
				saleMethod: selectedFilters.saleMethod
			};
		}

		const { locations, page, sort, ...bodyWithoutLocations } = selectedFilters;
		return {
			...bodyWithoutLocations,
			saleMethod: bodyWithoutLocations.saleMethod
		};
	};

	const handleFetchFilterCountError = (error: any) => {
		const errorMessage = error.message || EToastMsg.somethingWrong;
		toasterService.customToaster(`${errorMessage}`, 'error');
	};

	const fetchFilters = async (selectedFilters: IListingSrData) => {
		if (listingService.shouldSkipFilterCountFetch(selectedFilters, selectedLocation)) {
			return;
		}

		try {
			setIsLoading(true);
			const body = prepareFilterCountRequestData(selectedFilters);
			const res = await listingService.getListingsCount(body);
			if (res) {
				setIsLoading(false);
				setSearchBtnText(res.data.listingCountDisplayString);
			}
		} catch (error: any) {
			handleFetchFilterCountError(error);
			setIsLoading(false);
		}
	};

	const debouncedFetchFilters = useCallback(
		debounce((selectedFilters: IListingSrData) => fetchFilters(selectedFilters), debounceDelayKeys.twoHundredDelay),
		[]
	);

	useEffect(() => {
		debouncedFetchFilters(selectedFilters);
		return () => {
			debouncedFetchFilters.cancel();
		};
	}, [debouncedFetchFilters, selectedFilters]);

	return { searchBtnText, isLoading, selectedFilters, setToSelectedFilters };
};
