export interface ILocalStorageService {
	setItem(key: string, value: string): void;
	getItem(key: string): string | null;
	removeItem(key: string): void;

	setItemAsync(key: string, value: string): Promise<void>;
	getItemAsync(key: string): Promise<string | null>;
	removeItemAsync(key: string): Promise<void>;
}
