import { EGroupType } from '@findAgent/types/enum';
import { LocationsAndAgenciesSearchResponse, GroupSearchSuggestion } from '@findAgent/types/findAgent.types';
import { EGroupIcon } from '@shared/types/enums';

export class GroupSearchSuggestionMapper {
	static toPresentation(values: LocationsAndAgenciesSearchResponse): GroupSearchSuggestion[] {
		const { locations, agencies, agents } = values;

		const groups = [
			{
				groupIconType: EGroupIcon.locationPin,
				groupId: 'SUBURB',
				groupLabel: 'Location',
				optionsList: locations.map((location, index) => ({
					id: location.locationId.toString(),
					displayText: location.displayText,
					downshiftItemIndex: index,
					data: { ...location, type: EGroupType.SUBURB }
				}))
			},
			{
				groupIconType: EGroupIcon.building,
				groupId: 'AGENCY',
				groupLabel: 'Agency',
				optionsList: agencies.map((agency, index) => ({
					id: agency.id.toString(),
					displayText: agency.displayText,
					downshiftItemIndex: locations.length + index,
					data: { ...agency, type: EGroupType.AGENCY }
				}))
			},
			{
				groupIconType: EGroupIcon.building,
				groupId: 'AGENT',
				groupLabel: 'Agent',
				optionsList: agents.map((agent, index) => ({
					id: agent.id.toString(),
					displayText: agent.displayText,
					downshiftItemIndex: locations.length + agencies.length + index,
					data: { ...agent, type: EGroupType.AGENT }
				}))
			}
		];

		return groups.filter((group) => group.optionsList && group.optionsList.length > 0);
	}
}
