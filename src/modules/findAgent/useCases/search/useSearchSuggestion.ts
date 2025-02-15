import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useSharedService } from '@shared/hooks/useSharedService';
import { FindAgentSearchRepositoryImpl } from '@findAgent/infrastructure/implementations/repositories/findAgentSearch.repositories';
import { SearchSuggestionCommand } from '@findAgent/commands/searchSuggestion.command';
import { GroupSearchSuggestion } from '@findAgent/types/findAgent.types';
import { SearchSuggestionUseCase } from './searchSuggestion.usecase';

export const useSearchSuggestion = () => {
	const { httpService, configService } = useSharedService();

	const [searchKeyWord, setSearchKeyWord] = useState('');
	const [searchSuggestions, setSearchSuggestions] = useState<GroupSearchSuggestion[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);

	const debouncedExecute = useCallback(
		debounce(async (command: SearchSuggestionCommand) => {
			const searchRepo = new FindAgentSearchRepositoryImpl(httpService, configService);
			const searchSuggestionUseCase = new SearchSuggestionUseCase(searchRepo);
			const searchResponse = await searchSuggestionUseCase.execute(command);
			setSearchSuggestions(searchResponse);
			setSearchLoading(false);
		}, 300),
		[]
	);

	useEffect(() => {
		setSearchLoading(true);
		if (searchKeyWord.length < 2) {
			setSearchSuggestions([]);
			return;
		}
		searchKeyWord.length >= 2 && debouncedExecute({ searchKeyword: searchKeyWord });
		return () => {
			debouncedExecute.cancel();
		};
	}, [searchKeyWord]);

	const onFocusInput = () => {
		setSearchKeyWord('');
		setSearchSuggestions([]);
	};

	return { searchLoading, searchKeyWord, setSearchKeyWord, searchSuggestions, onFocusInput };
};
