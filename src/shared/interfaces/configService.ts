export interface IConfigService {
	getAppConfig(): Record<string, any>;
	getApiPaths(): Record<string, any>;
}
