import { IAuthorization } from '@shared/interfaces/authorization';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { INavigationService } from '@shared/interfaces/navigationService';
import { IToasterService } from '@shared/interfaces/toasterservice';

export class AuthorizationService implements IAuthorization {
	constructor(
		private storageService: ILocalStorageService,
		private navigationService: INavigationService,
		private toasterService: IToasterService
	) {}

	handle401Error(message: any) {
		this.storageService.removeItem('revUser');
		this.navigationService.reloadPage();
		this.toasterService.customToaster(message, 'error');
	}
}
