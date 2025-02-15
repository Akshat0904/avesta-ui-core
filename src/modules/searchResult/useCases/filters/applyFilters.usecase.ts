import { SortFilterCommand } from '@searchResult/commands/sortFilter.command';
import { SortFilterHandler } from '@searchResult/services/sortFilterHandler.service';

export class ApplyFiltersUseCase extends SortFilterHandler {
	async execute(command: SortFilterCommand) {
		return this.handle(command);
	}
}
