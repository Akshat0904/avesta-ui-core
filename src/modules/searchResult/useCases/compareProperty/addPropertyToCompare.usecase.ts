import { AddPropertyToCompareCommand } from '@searchResult/commands/compareProperty.command';
import { ComparePropertyService } from '@searchResult/services/compareProperty.service';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { EToastMsg } from '@shared/types/enums';

export class AddPropertyToCompareUseCase {
	constructor(private storageService: ILocalStorageService, private toasterService: IToasterService) {}
	execute(command: AddPropertyToCompareCommand) {
		const { compareProperties, selectedProperty } = command;

		if (ComparePropertyService.isPropertyExist(compareProperties, selectedProperty)) {
			return this.toasterService.customToaster('Property already exists', 'error');
		}

		if (ComparePropertyService.compareLimitExhausted(compareProperties)) {
			return this.toasterService.customToaster(EToastMsg.notMore10Properties, 'error');
		}

		const comparableProperties = [...compareProperties];

		comparableProperties.push(selectedProperty);

		this.storageService.setItem('__view_compareProperties', JSON.stringify(comparableProperties));

		this.toasterService.customToaster('Property added successfully', 'success');

		return comparableProperties;
	}
}
