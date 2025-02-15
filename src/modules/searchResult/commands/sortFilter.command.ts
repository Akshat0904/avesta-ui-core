import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EModuleType } from '@searchResult/types/enums';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { EAccessDeviceType } from '@shared/types/enums';
import { TSelectedSearch } from '@shared/types/types';

export type SortFilterCommand = {
	selectedLocations?: TSelectedSearch[];
	filters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	fromModuleType: EModuleType;
	srMapInstance: any;
	pageNo?: number;
	deviceType?: EAccessDeviceType;
	listingSrResponse?: ListingSrPageResponse;
};
