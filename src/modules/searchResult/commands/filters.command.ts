import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EModuleType } from '@searchResult/types/enums';
import { TSelectedSearch } from '@shared/types/types';

export type FiltersCommand = {
	selectedLocations?: TSelectedSearch[];
	filters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	fromModuleType: EModuleType;
	pageNo?: number;
};
