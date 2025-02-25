import { SaveSearchCommand } from '@searchResult/commands/saveSearch.command';
import { SaveSearch } from '@searchResult/types/types';
import { removeObjectKeys } from '@shared/utils/utils';

export class SaveSearchMapper {
	static toApiRequest(apiData: SaveSearchCommand): SaveSearch {
		return removeObjectKeys(apiData, ['appliedFilters', 'street', 'locationRecord']);
	}
}
