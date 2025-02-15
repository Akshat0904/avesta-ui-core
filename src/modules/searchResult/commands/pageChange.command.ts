import { TListingSrPageResponse } from '@listingSr/core/types/listingSrTypes';
import { IListingSrData, ISchoolCatchmentSrUrlFromData } from '@realestateview/avesta-js-core';
import { EModuleType } from '@searchResult/types/enums';
import { EAccessDeviceType } from '@shared/types/enums';

export type PageChangeCommand = {
	pageNumber: number;
};

export type PageChangeUsecaseCommand = PageChangeCommand & {
	listingSrResponse: TListingSrPageResponse;
	appliedFilters: IListingSrData & ISchoolCatchmentSrUrlFromData;
	deviceType: EAccessDeviceType;
	isFrom: EModuleType;
};
