import { useEffect, useState } from 'react';
import { TUserProfilePropertyInfo } from '../types/types';
import { useSharedService } from './useSharedService';

export const useSubscriberInfo = () => {
	const { storageService, authorizedService, toasterService, subscriberService } = useSharedService();

	const [subscriberInfo, setSubscriberInfo] = useState<TUserProfilePropertyInfo | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const getSubscriberInfo = async () => {
		setLoading(true);
		try {
			const subscriberInfo = await subscriberService.getSubscriberPropertyDetails();
			setSubscriberInfo(subscriberInfo.data);
			setLoading(false);
		} catch (error: any) {
			if (error.statusCode === 401) {
				authorizedService.handle401Error(error.message);
				setLoading(false);
			} else {
				toasterService.customToaster(error.message, 'error');
			}
		}
	};

	useEffect(() => {
		if (storageService.getItem('revUser')) {
			getSubscriberInfo();
		}
	}, []);

	return { subscriberInfo, loading, getSubscriberInfo };
};
