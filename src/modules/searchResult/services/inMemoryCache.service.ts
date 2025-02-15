import { CacheService } from '@searchResult/infrastructure/repositories/interfaces/cacheService.interface';

export class InMemoryCacheService implements CacheService {
	private cache: Map<string, any> = new Map();

	async set(key: string, value: any): Promise<void> {
		this.cache.set(key, value);
	}

	async get(key: string): Promise<any | null> {
		return this.cache.get(key) || null;
	}

	async remove(key: string): Promise<void> {
		this.cache.delete(key);
	}

	async has(key: string): Promise<boolean> {
		return this.cache.has(key);
	}

	async clear(): Promise<void> {
		this.cache.clear();
	}

	async keys(): Promise<string[]> {
		return Array.from(this.cache.keys());
	}

	async getAll(): Promise<Record<string, any>> {
		return Object.fromEntries(this.cache);
	}
}
