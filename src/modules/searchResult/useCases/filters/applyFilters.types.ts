import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EModuleType } from '@searchResult/types/enums';
import { ListingSrResponse } from '@searchResult/types/types';

export type recentSearchQuery = {
	filters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	fromModuleType: EModuleType;
	response: ListingSrResponse;
	url: string;
	latestFilters: IListingSrData & ISchoolCatchmentSrUrlFromData;
};
