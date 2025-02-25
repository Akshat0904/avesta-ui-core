import { SubscriberService } from '@shared/services/subscriberService';
import { ListingAnalyticsService } from '@listingSr/core/services/analytics/listingAnalyticsService';
import { IAuthorization } from '@shared/interfaces/authorization';
import { ListingService } from '@shared/services/listingService';
import { PropertyImageService } from '../services/propertyImageService';
import { ILocalStorageService } from './localStorageService';
import { IToasterService } from './toasterservice';
import { INavigationService } from './navigationService';
import { IHttpService } from './httpService';
import { IAnalyticsService } from './analyticsService';
import { IConfigService } from './configService';
import { IPropertyImageRepository } from './propertyImageRepository';
import { GovernmentPlaningAndZoneService } from '@shared/services/governmentPlaningAndZoneService';
import { RepaymentCalculatorService } from '@calculator/repaymentCalculator/services/repaymentCalculator.service';
import { ICalculatorAnalyticsService } from '@calculator/repaymentCalculator/infrastructure/repositories/interfaces/services/calculatorAnalyticsService.interface';
import { RecentSearchService } from '@searchResult/services/recentSearch.service';

export interface ISharedServiceContext {
	storageService: ILocalStorageService;
	toasterService: IToasterService;
	navigationService: INavigationService;
	configService: IConfigService;
	httpService: IHttpService;
	subscriberService: SubscriberService;
	GovernmentPlaningAndZoneService: GovernmentPlaningAndZoneService;
	authorizedService: IAuthorization;
	listingService: ListingService;
	propertyImageRepository: IPropertyImageRepository;
	propertyImageService: PropertyImageService;
	analyticsService: IAnalyticsService;
	listingAnalyticsService: ListingAnalyticsService;
	repaymentCalculatorService: RepaymentCalculatorService;
	listingCalculatorAnalyticsService: ICalculatorAnalyticsService;
	p360CalculatorAnalyticsService: ICalculatorAnalyticsService;
	recentSearchService: RecentSearchService;
}
