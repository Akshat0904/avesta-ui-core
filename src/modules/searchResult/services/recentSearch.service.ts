import { EListingCategory } from '@listingSr/core/types/listingSrEnum';
import { TRecentSearchesData } from '@listingSr/core/types/listingSrTypes';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import moment from 'moment';

export class RecentSearchService {
	constructor(private storageService: ILocalStorageService) {}

	public addLocationToRecentSearches = (currentTab: EListingCategory, data: TRecentSearchesData) => {
		const recentSearchData = {
			...data,
			timeStamp: moment().format('x')
		};

		const recentSearches = JSON.parse(this.storageService.getItem('__view_recentSearches') || '{}');

		if (recentSearches[currentTab]) {
			const existingIndex = recentSearches[currentTab].findIndex(
				(item: any) => item.pageUrl === recentSearchData.pageUrl
			);

			let updatedTabData;

			if (existingIndex !== -1) {
				updatedTabData = [
					recentSearchData,
					...recentSearches[currentTab].filter((_: any, index: number) => index !== existingIndex)
				];
			} else {
				updatedTabData = [recentSearchData, ...recentSearches[currentTab]];
			}
			if (updatedTabData.length > 3) {
				updatedTabData = updatedTabData.slice(0, 3);
			}

			const newRecentSearches = { ...recentSearches, [currentTab]: updatedTabData };
			this.storageService.setItem('__view_recentSearches', JSON.stringify(newRecentSearches));
		} else {
			const newRecentSearches = { ...recentSearches, [currentTab]: [recentSearchData] };
			this.storageService.setItem('__view_recentSearches', JSON.stringify(newRecentSearches));
		}
	};

	public getRecentSearchList = (tab: EListingCategory) => {
		const recentSearches = JSON.parse(this.storageService.getItem('__view_recentSearches') || '{}');
		return recentSearches[tab] || [];
	};

	public getLatestThreeSearches = () => {
		const recentSearches = JSON.parse(this.storageService.getItem('__view_recentSearches') || '{}');
		const allSearches = [
			...(recentSearches.Buy || []),
			...(recentSearches.Rent || []),
			...(recentSearches.Sold || []),
			...(recentSearches.Estimate || [])
		];
		const sortedSearches = allSearches.sort((a, b) => b.timeStamp - a.timeStamp);
		return sortedSearches.slice(0, 3);
	};

	public addRecentSearchFromUrl(url: string, currentTab: EListingCategory): void {
		const recentSearchedLocations = this.getRecentSearchList(currentTab);
		const searchData = recentSearchedLocations.find((search) => search.pageUrl === url);
		if (searchData) {
			this.addLocationToRecentSearches(currentTab, searchData);
		}
	}
}
