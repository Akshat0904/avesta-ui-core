import { EModuleType } from '@searchResult/types/enums';
import { SrFilter } from '@searchResult/types/types';
import { IMapInteractionService } from '@shared/interfaces/mapInteractionInterface';
import { EAccessDeviceType } from '@shared/types/enums';

export type MapPanUseCaseCommand = {
	filters: SrFilter;
	srMapInstance: IMapInteractionService;
	fromModuleType: EModuleType;
	deviceType: EAccessDeviceType;
	firstMapMove: boolean;
};

export type MapPanCommand = {
	firstMapMove: boolean;
};
