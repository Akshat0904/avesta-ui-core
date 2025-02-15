export interface INavigationService {
	navigateTo(url: string, screenName?: string, props?: Record<string, any>): void;
	reloadPage(): void;
	navigateToDetailPage(url: string, screenName?: string, props?: Record<string, any>): void;
}
