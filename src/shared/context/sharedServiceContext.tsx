import React, { createContext } from 'react';
import { diContainer } from '@shared/utils/diContainer';
import { ILocalStorageService } from '@shared/interfaces/localStorageService';
import { ISharedServiceContext } from '@shared/interfaces/sharedContext';
import { INavigationService } from '@shared/interfaces/navigationService';
import { IHttpService } from '@shared/interfaces/httpService';
import { IToasterService } from '@shared/interfaces/toasterservice';
import { PropertyImageService } from '@shared/services/propertyImageService';
import { IAuthorization } from '@shared/interfaces/authorization';
import { ListingAnalyticsService } from '@listingSr/core/services/analytics/listingAnalyticsService';
import { GovernmentPlaningAndZoneService } from '@shared/services/governmentPlaningAndZoneService';
import { ListingService } from '../services/listingService';
import { SubscriberService } from '../services/subscriberService';
import { IAnalyticsService } from '../interfaces/analyticsService';
import { IConfigService } from '../interfaces/configService';
import { IPropertyImageRepository } from '../interfaces/propertyImageRepository';
import { RepaymentCalculatorService } from '@calculator/repaymentCalculator/services/repaymentCalculator.service';
import { ICalculatorAnalyticsService } from '@calculator/repaymentCalculator/infrastructure/repositories/interfaces/services/calculatorAnalyticsService.interface';
import { RecentSearchService } from '@searchResult/services/recentSearch.service';

export const SharedContext = createContext<ISharedServiceContext | null>(null);

export const SharedServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const services: ISharedServiceContext = {
		storageService: diContainer.get<ILocalStorageService>('StorageService'),
		navigationService: diContainer.get<INavigationService>('NavigationService'),
		httpService: diContainer.get<IHttpService>('HttpService'),
		subscriberService: diContainer.get<SubscriberService>('SubscriberService'),
		GovernmentPlaningAndZoneService: diContainer.get<GovernmentPlaningAndZoneService>(
			'GovernmentPlaningAndZoneService'
		),
		authorizedService: diContainer.get<IAuthorization>('AuthorizationService'),
		toasterService: diContainer.get<IToasterService>('ToasterService'),
		listingService: diContainer.get<ListingService>('ListingService'),
		propertyImageRepository: diContainer.get<IPropertyImageRepository>('PropertyImageRepository'),
		propertyImageService: diContainer.get<PropertyImageService>('PropertyImageService'),
		analyticsService: diContainer.get<IAnalyticsService>('AnalyticsService'),
		configService: diContainer.get<IConfigService>('ConfigService'),
		listingAnalyticsService: diContainer.get<ListingAnalyticsService>('ListingAnalyticsService'),

		repaymentCalculatorService: diContainer.get<RepaymentCalculatorService>('RepaymentCalculatorService'),
		listingCalculatorAnalyticsService: diContainer.get<ICalculatorAnalyticsService>(
			'ListingCalculatorAnalyticsService'
		),
		p360CalculatorAnalyticsService: diContainer.get<ICalculatorAnalyticsService>('P360CalculatorAnalyticsService'),
		recentSearchService: diContainer.get<RecentSearchService>('RecentSearchService')
	};

	return <SharedContext.Provider value={services}>{children}</SharedContext.Provider>;
};
