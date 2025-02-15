import { TMatomoDimensions, TMatomoRequestDimensions } from '../types/matomo';

export interface IAnalyticsDataMapperService {
	transformData(args: TMatomoRequestDimensions | null): TMatomoDimensions;
}
