import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EModuleType } from '@searchResult/types/enums';

export type SortCommand = {
	filters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	fromModuleType: EModuleType;
	pageNo?: number;
};
