import { ListingSrPageResponse, PinListing, PinP360 } from '@searchResult/types/listingSrResponse';
import { SrFilter } from '@searchResult/types/types';
import { IMapInteractionService } from '@shared/interfaces/mapInteractionInterface';
import { EAccessDeviceType, EModuleType } from '@shared/types/enums';

export type MarkersInBound = { listingPinsInBound: PinListing[]; p360PinsInBound: PinP360[] };

export type MapZoomCommand = {
	isFirstMapMove: boolean;
	previousZoomLevel: number;
};
export type MapZoom = {
	zoom: number;
	boundingBox: any;
	previousZoomLevel: number;
};

export type MapZoomInCommand = {
	filters: SrFilter;
	srMapInstance: IMapInteractionService;
	fromModuleType: EModuleType;
	deviceType: EAccessDeviceType;
	listingSrResponse: ListingSrPageResponse;
	isFirstMapMove: boolean;
	zoom: number;
};

export type MapZoomOutCommand = {
	filters: SrFilter;
	srMapInstance: IMapInteractionService;
	fromModuleType: EModuleType;
	deviceType: EAccessDeviceType;
	listingSrResponse: ListingSrPageResponse;
	isFirstMapMove: boolean;
	zoom: number;
};

// Keep this for backward compatibility if needed
export type MapZoomUseCaseCommand = MapZoomInCommand | MapZoomOutCommand;
