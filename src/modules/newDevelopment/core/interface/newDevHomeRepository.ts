import { THomePageResponse, TInvestmentPropertyParams } from '../types/newDevelopmentTypes';

export interface INewDevHomeRepository {
	getInvestmentProperty: (params: TInvestmentPropertyParams) => Promise<THomePageResponse>;
}
