import { useState } from 'react';
import { TAddOrRemoveShortlistPropertyBodyParams } from '@shared/types/types';
import { useSharedService } from './useSharedService';

export const useShortlistApiRequest = () => {
	const { toasterService, authorizedService, subscriberService } = useSharedService();

	const [loading, setLoading] = useState<boolean>(false);

	const removeShortlistProperty = async (shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams) => {
		setLoading(true);
		try {
			return await subscriberService.removePropertyFromShortlist(shortlistPropertyParams);
		} catch (error: any) {
			if (error.statusCode === 401) {
				authorizedService.handle401Error(error.message);
				setLoading(false);
			} else {
				toasterService.customToaster(error.message, 'error');
			}
		}
	};

	const addShortlistProperty = async (shortlistPropertyParams: TAddOrRemoveShortlistPropertyBodyParams) => {
		setLoading(true);
		try {
			return await subscriberService.addPropertyToShortlist(shortlistPropertyParams);
		} catch (error: any) {
			if (error.statusCode === 401) {
				authorizedService.handle401Error(error.message);
				setLoading(false);
			} else {
				toasterService.customToaster(error.message, 'error');
			}
		}
	};

	return { addShortlistProperty, removeShortlistProperty, loading, setLoading };
};
