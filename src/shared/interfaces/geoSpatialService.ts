type TGeoJSONMultiPolygon = {
	type: 'MultiPolygon';
	coordinates: number[][][][];
};

export type TSquareGridOptions = {
	units?: 'miles' | 'kilometers' | 'degrees' | 'radians';
	mask?: TGeoJSONFeature<TGeoJSONPolygon | TGeoJSONMultiPolygon>;
	properties?: { [key: string]: any };
};

export type TGeoJSONPolygonCoordinates = number[][][];
type TGeoJSONPolygon = {
	type: 'Polygon';
	coordinates: TGeoJSONPolygonCoordinates;
};

export type TGeoJSONFeatureProperties = {
	[name: string]: any; // A dictionary of key-value pairs to hold properties associated with the feature.
};

export type TGeoJSONCoordinates = number[] | number[][] | number[][][] | number[][][][];

export type TGeoJSONGeometry = {
	type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection';
	coordinates?: TGeoJSONCoordinates;
	geometries?: TGeoJSONGeometry[]; // Only for GeometryCollection
};

export type TGeoJSONFeature<TGeometry = TGeoJSONGeometry> = {
	type: 'Feature';
	geometry: TGeometry;
	properties: TGeoJSONFeatureProperties | null;
	id?: string | number;
};

export type TGeoJSONFeatureCollection<TGeometry = TGeoJSONGeometry> = {
	type: 'FeatureCollection';
	features: TGeoJSONFeature<TGeometry>[];
};

export interface IGeoSpatialService {
	bBoxPolygon(bbox: number[]): TGeoJSONFeature<TGeoJSONPolygon>;
	computeBBox(geoJson: TGeoJSONFeature | TGeoJSONFeatureCollection | TGeoJSONGeometry): number[];
	squareGrid(
		bbox: number[],
		cellSide: number,
		options?: TSquareGridOptions
	): TGeoJSONFeatureCollection<TGeoJSONPolygon>;
	isPolygonInExtent(
		geoJson1: TGeoJSONFeature | TGeoJSONGeometry,
		geoJson2: TGeoJSONFeature | TGeoJSONGeometry
	): boolean;

	distance(
		topPoint: number[],
		bottomPoint: number[],
		units?: 'miles' | 'kilometers' | 'degrees' | 'radians' | 'meters'
	): number;
}
