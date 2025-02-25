import { EAppsPageType } from '@shared/types/enums';

export class AnalyticsManagerService {
	public appsPageType: EAppsPageType;
	constructor(aAppsPageType: EAppsPageType) {
		this.appsPageType = aAppsPageType;
	}

	get() {
		return this.appsPageType;
	}

	set(aAppsPageType: EAppsPageType) {
		this.appsPageType = aAppsPageType;
	}
}
