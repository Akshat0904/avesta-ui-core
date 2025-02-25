import { IListingSrData, ILocation, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { storageKeys } from '@shared/constants/constants';
import { TRecentSearchLocations, TRecentSearches } from '@shared/types/types';
import { useSharedService } from './useSharedService';
import { EModuleType } from '@shared/types/enums';

export const useRecentSearch = () => {
	const { storageService } = useSharedService();

	const MAX_RECENT_SEARCHES = 3;

	const recentSearchKey = storageKeys.recentSearchLocations;

	const getRecentSearch = (): TRecentSearchLocations => {
		const recentSearch = storageService.getItem(recentSearchKey);

		if (!recentSearch) {
			return [];
		}

		const recentSearchedLocations = JSON.parse(recentSearch);
		return recentSearchedLocations || [];
	};

	const saveRecentSearch = (recentLocations: TRecentSearchLocations) => {
		storageService.setItem(recentSearchKey, JSON.stringify(recentLocations));
	};

	const getRecentSearchesLocation = () => {
		const recentSearchedLocations = getRecentSearch();
		return recentSearchedLocations;
	};

	// const addRecentSearch = (selectedLocation: TRecentSearches) => {
	// 	const recentSearchedLocations = getRecentSearch();

	// 	const existingIndex = recentSearchedLocations.findIndex(
	// 		(search) => search.pageUrl === selectedLocation.pageUrl
	// 	);

	// 	if (existingIndex !== -1) {
	// 		recentSearchedLocations.splice(existingIndex, 1);
	// 	}

	// 	if (recentSearchedLocations.length > MAX_RECENT_SEARCHES) {
	// 		recentSearchedLocations.shift();
	// 	}

	// 	saveRecentSearch(recentSearchedLocations);
	// };

	const addRecentSearch = (selectedLocation: TRecentSearches) => {
		const recentSearchedLocations = getRecentSearch();

		const homeSearches = recentSearchedLocations.filter((search) => search.type === EModuleType.HOME);
		const newDevelopmentSearches = recentSearchedLocations.filter((search) => search.type === EModuleType.PROJECT);
		const schoolCatchmentSearches = recentSearchedLocations.filter((search) => search.type === EModuleType.SCHOOL);

		let searchesToUpdate: TRecentSearches[];
		if (selectedLocation.type === EModuleType.HOME) {
			searchesToUpdate = homeSearches;
		} else if (selectedLocation.type === EModuleType.PROJECT) {
			searchesToUpdate = newDevelopmentSearches;
		} else {
			searchesToUpdate = schoolCatchmentSearches;
		}

		const existingIndex = searchesToUpdate.findIndex((search) => search.pageUrl === selectedLocation.pageUrl);

		if (existingIndex !== -1) {
			searchesToUpdate.splice(existingIndex, 1);
		}

		searchesToUpdate.unshift(selectedLocation);

		if (searchesToUpdate.length > MAX_RECENT_SEARCHES) {
			searchesToUpdate.pop();
		}

		const updatedRecentSearches = [...homeSearches, ...newDevelopmentSearches, ...schoolCatchmentSearches];

		saveRecentSearch(updatedRecentSearches);
	};

	const addPropertyToRecentSearch = (
		displayName: string[],
		pageUrl: string,
		locations: ILocation[],
		type?: EModuleType
	) => {
		return addRecentSearch({
			isUnListed: true,
			displayName,
			pageUrl,
			locations,
			type
		});
	};

	const addLocationToRecentSearch = (
		displayName: string[],
		pageUrl: string,
		filters: IListingSrData & ISchoolCatchmentSrUrlFromData,
		locations: ILocation[],
		type?: EModuleType
	) => {
		return addRecentSearch({
			...filters,
			displayName,
			pageUrl,
			locations,
			type
		});
	};

	const addRecentSearchFromUrl = (url: string) => {
		const recentSearchedLocations = getRecentSearch();

		const searchData = recentSearchedLocations.find((search) => search.pageUrl === url);
		if (!searchData) {
			return;
		}
		addRecentSearch(searchData);
	};

	return {
		getRecentSearchesLocation,
		addLocationToRecentSearch,
		addPropertyToRecentSearch,
		addRecentSearchFromUrl
	};
};
