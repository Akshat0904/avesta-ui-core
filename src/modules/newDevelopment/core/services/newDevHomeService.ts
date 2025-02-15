import { INewDevHomeRepository } from '../interface/newDevHomeRepository';
import { TInvestmentPropertyParams } from '../types/newDevelopmentTypes';

export class NewDevHomeService {
	constructor(private repo: INewDevHomeRepository) {}

	getInvestmentProperty(params: TInvestmentPropertyParams) {
		return this.repo.getInvestmentProperty(params);
	}
}
