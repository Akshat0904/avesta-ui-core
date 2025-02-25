import { PropertyGroupSearchSuggestion, PropertyResponse } from '@findAgent/types/findAgent.types';
import { EGroupIcon } from '@shared/types/enums';

export class GroupPropertySearchSuggestionMapper {
	static toPresentation(values: PropertyResponse[]): PropertyGroupSearchSuggestion {
		const groups = {
			groupIconType: EGroupIcon.locationPin,
			groupId: 'PROPERTY',
			groupLabel: '',
			optionsList: values.map((value, index) => ({
				id: value.lgaId.toString(),
				displayText: value.address,
				downshiftItemIndex: index,
				data: value
			}))
		};
		return groups;
	}
}
