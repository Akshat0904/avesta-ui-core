export interface CacheService {
	set(key: string, value: any): Promise<void>;

	get(key: string): Promise<any | null>;

	remove(key: string): Promise<void>;

	has(key: string): Promise<boolean>;

	clear(): Promise<void>;

	keys(): Promise<string[]>;

	getAll(): Promise<Record<string, any>>;
}
