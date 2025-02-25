import { offSeeAllToggleCommand } from '@searchResult/commands/offSeeAllToggle.command';

export class OffSeeAllToggleUseCase {
	static execute(command: offSeeAllToggleCommand) {
		const { listingSrResponse, srMapInstance } = command;

		if (srMapInstance) {
			srMapInstance.removeOverlaysToolTip('overlay-popup');
		}

		return {
			...listingSrResponse,
			p360Properties: {
				total: 0,
				data: []
			}
		};
	}
}
