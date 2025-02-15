import { MarkerClickUseCaseCommand } from '@searchResult/commands/markerClick.command';
import { RecentlyViewService } from '@searchResult/services/recentlyView.service';
import { ListingSrPageResponse } from '@searchResult/types/listingSrResponse';
import { TSelectedMarkersData } from '@shared/types/types';

export class MarkerClickUseCase {
	constructor(private recentlyViewService: RecentlyViewService) {}

	async execute(command: MarkerClickUseCaseCommand) {
		const { selectedMarker, listingSrResponse } = command;

		const propertyDetails = selectedMarker
			.map((aDetails) => this.getSelectedMarkersData(listingSrResponse, aDetails))
			.filter(Boolean);

		return await this.recentlyViewService.handleMarkerRecentViewUpdate(listingSrResponse, propertyDetails);
	}

	private getSelectedMarkersData = (listingSrResponse: ListingSrPageResponse, markerData: TSelectedMarkersData) => {
		if (markerData.isListing) {
			return listingSrResponse.pins.find((pin) => pin.id === markerData.id);
		}
		return listingSrResponse.p360Properties.data.find((property) => property.seoSlug === markerData.id);
	};
}
