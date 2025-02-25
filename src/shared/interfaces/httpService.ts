export interface IHttpService {
	get<T>(aParams: { path: string; queryParams?: Record<string, any> }): Promise<T>;
	post<T>(aParams: {
		path: string;
		body: Record<string, any>;
		headers?: Record<string, any>;
		config?: Record<string, any>;
	}): Promise<T>;
	put<T>(aParams: { path: string; body: Record<string, any> }): Promise<T>;
	delete<T>(aParams: { path: string; body: Record<string, any> }): Promise<T>;
}
