import { EModuleType } from '@searchResult/types/enums';
import { SrFilter } from '@searchResult/types/types';
import { EAccessDeviceType } from '@shared/types/enums';
import { TSelectedSearch } from '@shared/types/types';

export type LocationChangeHandlerCommand = {
	appliedFilters: SrFilter;
	searchKeyword: string;
	selectedLocations: TSelectedSearch[];
	fromModuleType?: EModuleType;
	deviceType?: EAccessDeviceType;
	recentSearchFromPage?: EModuleType;
	screenName?: string;
	props?: any;
};

export type LocationChangeCommand = {
	searchKeyword: string;
	selectedLocations: TSelectedSearch[];
	screenName?: string;
	appliedFilters?: SrFilter;
	props?: Record<string, any>;
	deviceType?: EAccessDeviceType;
	fromModuleType: EModuleType;
};
