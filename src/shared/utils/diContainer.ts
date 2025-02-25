class DIContainer {
	private instances = new Map<string, any>();
	private registrations = new Map<string, { constructor: new (...args: any[]) => any; args: any[] }>();
	register<T>(identifier: string, constructor: new (...args: any[]) => T, ...args: any[]) {
		this.registrations.set(identifier, { constructor, args });
	}
	get<T>(identifier: string): T {
		if (!this.instances.has(identifier)) {
			const registration = this.registrations.get(identifier);
			if (!registration) {
				throw new Error(`Service ${identifier} not registered.`);
			}
			const { constructor, args } = registration;
			const resolvedArgs = args.map((arg) => (typeof arg === 'function' ? arg(this) : arg));
			const instance = new constructor(...resolvedArgs);
			this.instances.set(identifier, instance);
			return instance;
		}
		return this.instances.get(identifier) as T;
	}
}
export const diContainer = new DIContainer();
