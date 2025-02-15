import { TListingSrResponse } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EModuleType } from '@searchResult/types/enums';

export type recentSearchQuery = {
	filters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	fromModuleType: EModuleType;
	response: TListingSrResponse;
	url: string;
	latestFilters: IListingSrData & ISchoolCatchmentSrUrlFromData;
};
