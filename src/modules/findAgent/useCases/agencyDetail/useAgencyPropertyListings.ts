import { useEffect, useMemo, useState, useRef } from 'react';
import { ESaleMethod, EPropertyTypes } from '@realestateview/avesta-js-core';
import {
	BedroomType,
	PropertyTypeFilter,
	TabType,
	Listing,
	AgencyProfileResponse
} from '@findAgent/types/agency.types';
import { renderPageType } from '@listingSr/presentation/utils/utils';
import { useSharedService } from '@shared/hooks/useSharedService';
import { AgencyPropertyListingCommand } from '@findAgent/commands/propertyListing.command';
import { PropertyListingsRepositoryImpl } from '@findAgent/infrastructure/implementations/repositories/propertyListings.impl';
import { FindAgentPageViewAnalyticsService } from '@findAgent/services/analytics/findAgentPageViewAnalytics.service';
import { FindAgentAnalyticsService } from '@findAgent/services/analytics/findAgentAnalytics.service';
import { AgencyPropertyListingsUseCase } from '../propertyListings/agencyPropertyListings.usecase';
import { SeeMoreAgencyListingsUseCase } from '../propertyListings/seeMoreAgencyListings.usecase';

interface UseAgencyPropertyListingsProps {
	agencyId: number;
	agencyProfile: AgencyProfileResponse;
	initialSaleMethod: ESaleMethod;
	initialPropertyType: PropertyTypeFilter;
}

export const useAgencyPropertyListings = ({
	agencyId,
	agencyProfile,
	initialSaleMethod,
	initialPropertyType
}: UseAgencyPropertyListingsProps) => {
	const [listings, setListings] = useState<Listing[]>(agencyProfile.listings?.data.slice(0, 3) || []);
	const [listingActiveTab, setListingActiveTab] = useState<TabType>(initialSaleMethod as TabType);
	const [selectedBedrooms, setSelectedBedrooms] = useState<BedroomType>('Any');
	const [isBedroomDropdownOpen, setIsBedroomDropdownOpen] = useState(false);
	const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyTypeFilter>(initialPropertyType);
	const [page, setPage] = useState(1);
	const [totalListings, setTotalListings] = useState(agencyProfile.listings?.total || 0);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isFirstRender = useRef(true);

	const { configService, httpService, analyticsService } = useSharedService();
	const PropertyListingsRepository = new PropertyListingsRepositoryImpl(httpService, configService);
	const agencyPropertyListings = new AgencyPropertyListingsUseCase(PropertyListingsRepository);
	const seeMoreAgencyListings = new SeeMoreAgencyListingsUseCase(PropertyListingsRepository);

	const agencyDetailMatomo = useMemo(
		() => new FindAgentAnalyticsService(analyticsService),
		[httpService, configService]
	);

	const seeMoreAgencyListingsMatomo = useMemo(
		() => new FindAgentPageViewAnalyticsService(analyticsService),
		[httpService, configService]
	);

	const fetchListings = async (isLoadMore = false) => {
		setIsLoading(true);

		const currentSize = isLoadMore ? 10 : 3;
		let currentPage = 1;

		if (isLoadMore) {
			if (listings.length > 3) {
				currentPage = Math.ceil(listings.length / 10) + 1;
			}
		}

		const command: AgencyPropertyListingCommand = {
			agencyId,
			saleMethod: listingActiveTab,
			...(propertyTypeFilter !== 'all' && { propertyType: propertyTypeFilter as EPropertyTypes }),
			...(selectedBedrooms !== 'Any' && { bedrooms: selectedBedrooms }),
			page: currentPage,
			size: currentSize
		};

		try {
			const result = isLoadMore
				? await seeMoreAgencyListings.execute(command)
				: await agencyPropertyListings.execute(command);

			setTotalListings(result.total);

			if (isLoadMore) {
				if (listings.length === 3) {
					// First "see more" click: replace existing 3 items with first 10
					setListings(result.data);
				} else {
					// Subsequent "see more" clicks: append new items
					setListings((prev) => [...prev, ...result.data]);
				}
			} else {
				// Initial load or "see less": just show first 3
				setListings(result.data);
			}
			setPage(currentPage);
		} catch (error) {
			console.error('Error fetching listings:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSeeMore = () => {
		fetchListings(true);
	};

	const handleSeeLess = () => {
		fetchListings(false);
	};

	// Calculate if we have more items to load
	const hasMore = listings.length < totalListings;

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		setIsExpanded(false);
		fetchListings(false);
	}, [selectedBedrooms, propertyTypeFilter, listingActiveTab, agencyId]);

	const filterPropertiesMatomo = () => {
		agencyDetailMatomo.trackFilterProperties({
			agencyId,
			bedroom: selectedBedrooms,
			...(propertyTypeFilter !== 'all' && { propertyType: propertyTypeFilter as EPropertyTypes }),
			...(agencyProfile?.isReipAgency && { isReipAgency: agencyProfile?.isReipAgency })
		});
	};

	useEffect(() => {
		filterPropertiesMatomo();
	}, [propertyTypeFilter, selectedBedrooms]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (listings && listings.length > 0) {
			listings.forEach((listing) => {
				seeMoreAgencyListingsMatomo.trackAgentAgencyPropertyListings({
					agencyId,
					bedroom: listing.bedrooms,
					tierType: listing?.rank,
					listingType: [renderPageType([listing.saleMethod])],
					bathroom: listing.bathrooms,
					carpark: listing.carparks,
					city: listing.city,
					isReipAgency: agencyProfile?.isReipAgency,
					isReipListing: listing.isReipListing,
					lgaName: listing.lgaName,
					listingId_GnafId: listing.id.toString(),
					postCode: listing.postcode,
					propertyType: listing.primaryPropertyType,
					propertyTypeMul: listing.propertyTypes,
					state: listing.state,
					street: listing.streetName,
					suburb: listing.suburbName
				});
			});
		}
	}, [listings]); // Only trigger when listings change

	return {
		listings,
		listingActiveTab,
		selectedBedrooms,
		isBedroomDropdownOpen,
		propertyTypeFilter,
		isExpanded,
		totalListings,
		isLoading,
		hasMore,
		onTabChange: (tab: TabType) => {
			setListingActiveTab(tab);
			setIsExpanded(false);
		},
		onBedroomChange: (bedroom: BedroomType) => {
			setSelectedBedrooms(bedroom);
			setIsExpanded(false);
		},
		onBedroomDropdownToggle: setIsBedroomDropdownOpen,
		onPropertyTypeChange: (type: PropertyTypeFilter) => {
			setPropertyTypeFilter(type);
			setIsExpanded(false);
		},
		onExpandToggle: (expanded: boolean) => {
			setIsExpanded(expanded);
			if (expanded) {
				handleSeeMore();
			} else {
				handleSeeLess();
			}
		}
	};
};
