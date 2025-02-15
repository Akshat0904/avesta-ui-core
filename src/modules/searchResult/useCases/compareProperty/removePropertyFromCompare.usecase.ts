import { RemovePropertyFromCompareCommand } from '@searchResult/commands/compareProperty.command';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';

export class RemovePropertyFromCompareUseCase {
	constructor(private storageService: ILocalStorageService, private toasterService: IToasterService) {}
	execute(command: RemovePropertyFromCompareCommand) {
		const { compareProperties, id } = command;

		const updatedProperties = compareProperties.filter((property) => property.id.toString() !== id.toString());

		this.storageService.setItem('__view_compareProperties', JSON.stringify(updatedProperties));

		this.toasterService.customToaster(EToastMsg.propertyRemoved, 'success');

		return updatedProperties;
	}
}
