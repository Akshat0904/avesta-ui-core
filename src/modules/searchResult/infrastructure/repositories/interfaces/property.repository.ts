export interface PropertyRepository {
	getDetailUrl: (gnafId: string) => Promise<string>;
}
