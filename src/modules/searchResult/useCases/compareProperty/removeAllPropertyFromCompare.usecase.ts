import { ILocalStorageService } from '@shared/interfaces/localStorageService';

export class RemoveAllPropertyFromCompareUseCase {
	constructor(private storageService: ILocalStorageService) {}
	execute() {
		this.storageService.removeItem('__view_compareProperties');
	}
}
