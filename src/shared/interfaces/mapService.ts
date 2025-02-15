import { TMarkerData } from '../types/types';

export abstract class IMapService {
	abstract setCenter(latitude: number, longitude: number, zoomLevel: number): void;
	abstract addMarkers(markers: TMarkerData[]): void;
	abstract dispose(): void;
}
