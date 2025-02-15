import { IEventStrategyService } from './eventStrategyService';

export class EventStrategyRegistryService {
	private strategies: Map<string, IEventStrategyService>;

	constructor() {
		this.strategies = new Map();
	}

	registerStrategy(eventType: string, strategy: IEventStrategyService) {
		this.strategies.set(eventType, strategy);
	}

	getStrategy(eventType: string): IEventStrategyService | undefined {
		return this.strategies.get(eventType) || this.strategies.get('default');
	}
}
