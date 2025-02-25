import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { EAccessDeviceType } from '@shared/types/enums';
import { TSelectedMarkersData } from '@shared/types/types';

export type MarkerClickCommand = {
	selectedMarker: TSelectedMarkersData[];
};

export type MarkerClickUseCaseCommand = {
	selectedMarker: TSelectedMarkersData[];
	listingSrResponse: ListingSrPageResponse;
	deviceType: EAccessDeviceType;
};
