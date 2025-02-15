import { LocationChangeHandlerCommand } from '@searchResult/commands/locationChange.command';
import { LocationSearchResultResponse } from '@searchResult/types/types';

export interface LocationChangeHandler {
	handle(command: LocationChangeHandlerCommand): Promise<LocationSearchResultResponse | void>;
}
