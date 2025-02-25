import { TSrPageScreen } from '@listingSr/core/types/listingSrTypes';

export class SrViewService {
	private searchResultScreen: TSrPageScreen;
	public getSearchResultScreen(): TSrPageScreen {
		return this.searchResultScreen;
	}

	public setSearchResultScreen(value: TSrPageScreen) {
		this.searchResultScreen = value;
	}
}
