export interface ModuleDoc {
	name: string;
	useCases: ClassDoc[];
	services: ClassDoc[];
}

export interface ClassDoc {
	name: string;
	description: string;
	constructor?: ConstructorDoc;
	methods: MethodDoc[];
}

export interface ConstructorDoc {
	parameters: ParameterDoc[];
}

export interface MethodDoc {
	name: string;
	description: string;
	parameters: ParameterDoc[];
	returnType: string;
}

export interface ParameterDoc {
	name: string;
	type: string;
}
