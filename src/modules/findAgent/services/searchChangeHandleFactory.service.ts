import { EAgentAgencyTab, EGroupType } from '@findAgent/types/enum';
import { UrlService } from '@realestateview/avesta-js-core';

export class SearchChangeHandleFactory {
	create(command: any, activeTab?: EAgentAgencyTab) {
		switch (command.type) {
			case EGroupType.SUBURB: {
				let url = '';
				if (activeTab === EAgentAgencyTab.AGENCY) {
					url = UrlService.AgencySr.getUrlFromAgencySrData({
						state: command.state,
						suburbName: command.suburbName,
						postcode: command.postcode
					});
				} else {
					url = UrlService.AgentSr.getUrlFromAgentSrData({
						state: command.state,
						suburbName: command.suburbName,
						postcode: command.postcode
					});
				}
				return url;
			}

			case EGroupType.AGENCY: {
				const url = UrlService.AgencyDetails.getAgencyUrlFromData({
					agencySlug: command.slug,
					agencyId: command._id
				});
				return url;
			}

			case EGroupType.AGENT: {
				const url = UrlService.AgentDetails.getAgentUrlFromData({
					agentName: `${command.firstName} ${command.lastName}`,
					agentId: command._id
				});
				return url;
			}
		}
	}
}
