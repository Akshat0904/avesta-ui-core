import React, { createContext } from 'react';
import { ListingSrService } from '@listingSr/core/services/listingSrService';
import { IListingSrRepository } from '@listingSr/core/interfaces/listingSrRepository';
import { diContainer } from '@shared/utils/diContainer';
import { IServiceContext } from '@shared/interfaces/serviceContext';
import { PriceEstimatorService } from '@listingSr/core/services/priceEstimatorService';
import { SrAnalyticsService } from '@listingSr/core/services/analytics/srAnalyticsService';
import { ISrAnalyticsService } from '@listingSr/core/interfaces/srAnalyticsService';
import { ISrCacheService } from '@shared/interfaces/srCacheService';
import { BoundingBoxService } from '@shared/services/boundingBoxService';
import { IGeoSpatialService } from '../interfaces/geoSpatialService';
import { AnalyticsManagerService } from '@shared/services/analyticsManagerService';
import { LocationChangeUseCase } from '@searchResult/useCases/locationChange/locationChange.usecase';
import { SaveSearchUseCase } from '@searchResult/useCases/saveSearch/saveSearch.usecase';
import { SaveNoteUseCase } from '@searchResult/useCases/note/saveNote.usecase';
import { DeleteNoteUseCase } from '@searchResult/useCases/note/deleteNote.usecase';
import { AddShortlistUseCase } from '@searchResult/useCases/shortlistProperty/addShortlist.usecase';
import { RemoveShortlistUseCase } from '@searchResult/useCases/shortlistProperty/removeShortlist.usecase';
import { ApplyFiltersUseCase } from '@searchResult/useCases/filters/applyFilters.usecase';
import { ApplySortUseCase } from '@searchResult/useCases/sort/applySort.usecase';
import { PageChangeUseCase } from '@searchResult/useCases/pageChange/pageChange.useCase';
import { AddPropertyToCompareUseCase } from '@searchResult/useCases/compareProperty/addPropertyToCompare.usecase';
import { RemoveAllPropertyFromCompareUseCase } from '@searchResult/useCases/compareProperty/removeAllPropertyFromCompare.usecase';
import { RemovePropertyFromCompareUseCase } from '@searchResult/useCases/compareProperty/removePropertyFromCompare.usecase';
import { CreateNewCompareGroupUseCase } from '@searchResult/useCases/compareProperty/createNewCompareGroup.usecase';
import { GetCompareGroupsListUseCase } from '@searchResult/useCases/compareProperty/getCompareGroupsList.usecase';
import { SavePropertiesToCompareGroupUseCase } from '@searchResult/useCases/compareProperty/savePropertiesToCompareGroup.usecase';
import { OffSeeAllToggleUseCase } from '@searchResult/useCases/seeAllToggle/offSeeAllToggle.usecase';
import { OnSeeAllToggleUseCase } from '@searchResult/useCases/seeAllToggle/onSeeAllToggle.usecase';
import { SendEnquiryUseCase } from '@searchResult/useCases/sendEnquiry/sendEnquiry.usecase';
import { MapPanUseCase } from '@searchResult/useCases/mapPan/mapPan.usecase';
import { MapZoomInUseCase } from '@searchResult/useCases/mapZoom/mapZoomIn.usecase';
import { MapZoomOutUseCase } from '@searchResult/useCases/mapZoom/mapZoomOut.usecase';
import { MarkerClickUseCase } from '@searchResult/useCases/markerClick/markerClick.usecase';
import { SrViewService } from '@searchResult/services/srView.service';

export const ServiceContext = createContext<IServiceContext | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const services: IServiceContext = {
		priceEstimatorService: diContainer.get<PriceEstimatorService>('PriceEstimatorService'),
		listingSrService: diContainer.get<ListingSrService>('ListingSrService'),
		geoSpatialService: diContainer.get<IGeoSpatialService>('geoSpatialService'),
		listingSrRepository: diContainer.get<IListingSrRepository>('ListingSrRepository'),
		srAnalyticsService: diContainer.get<SrAnalyticsService>('SrAnalyticsService'),
		srCacheService: diContainer.get<ISrCacheService>('SrCacheService'),
		listingSrServiceWithNullAnalyticsService: diContainer.get<ListingSrService>(
			'ListingSrServiceWithNullAnalyticsService'
		),
		nullListingSrAnalyticsService: diContainer.get<ISrAnalyticsService>('NullListingSrAnalyticsService'),
		boundingBoxService: diContainer.get<BoundingBoxService>('BoundingBoxService'),
		srViewService: diContainer.get<SrViewService>('SrViewService'),
		analyticsManagerService: diContainer.get<AnalyticsManagerService>('AnalyticsManagerService'),
		locationChangeUseCase: diContainer.get<LocationChangeUseCase>('LocationChangeUseCase'),
		saveSearchUseCase: diContainer.get<SaveSearchUseCase>('SaveSearchUseCase'),
		addShortlistUseCase: diContainer.get<AddShortlistUseCase>('AddShortlistUseCase'),
		removeShortlistUseCase: diContainer.get<RemoveShortlistUseCase>('RemoveShortlistUseCase'),
		deleteNoteUseCase: diContainer.get<DeleteNoteUseCase>('DeleteNoteUseCase'),
		saveNoteUseCase: diContainer.get<SaveNoteUseCase>('SaveNoteUseCase'),
		filtersUseCase: diContainer.get<ApplyFiltersUseCase>('ApplyFiltersUseCase'),
		sortUseCase: diContainer.get<ApplySortUseCase>('ApplySortUseCase'),
		pageChangeUseCase: diContainer.get<PageChangeUseCase>('PageChangeUseCase'),
		addPropertyToCompareUseCase: diContainer.get<AddPropertyToCompareUseCase>('AddPropertyToCompareUseCase'),
		removePropertyFromCompareUseCase: diContainer.get<RemovePropertyFromCompareUseCase>(
			'RemovePropertyFromCompareUseCase'
		),
		removeAllPropertiesFromCompareUseCase: diContainer.get<RemoveAllPropertyFromCompareUseCase>(
			'RemoveAllPropertyFromCompareUseCase'
		),
		savePropertiesToCompareGroupUseCase: diContainer.get<SavePropertiesToCompareGroupUseCase>(
			'SavePropertiesToCompareGroupUseCase'
		),
		createNewCompareGroupUseCase: diContainer.get<CreateNewCompareGroupUseCase>('CreateNewCompareGroupUseCase'),
		getCompareGroupsListUseCase: diContainer.get<GetCompareGroupsListUseCase>('GetCompareGroupsListUseCase'),
		offSeeAllToggleUseCase: diContainer.get<OffSeeAllToggleUseCase>('OffSeeAllToggleUseCase'),
		onSeeAllToggleUseCase: diContainer.get<OnSeeAllToggleUseCase>('OnSeeAllToggleUseCase'),
		sendEnquiryUseCase: diContainer.get<SendEnquiryUseCase>('SendEnquiryUseCase'),
		mapPanUseCase: diContainer.get<MapPanUseCase>('MapPanUseCase'),
		mapZoomInUseCase: diContainer.get<MapZoomInUseCase>('MapZoomInUseCase'),
		mapZoomOutUseCase: diContainer.get<MapZoomOutUseCase>('MapZoomOutUseCase'),
		markerClickUseCase: diContainer.get<MarkerClickUseCase>('MarkerClickUseCase')
	};

	return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
};
