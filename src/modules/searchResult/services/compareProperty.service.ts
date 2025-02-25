import { CompareProperty } from '@searchResult/types/types';

export class ComparePropertyService {
	static isPropertyExist(compareProperties: CompareProperty[], selectedProperty: CompareProperty) {
		return compareProperties.find((property) => property.id.toString() === selectedProperty.id.toString());
	}

	static compareLimitExhausted(compareProperties: CompareProperty[]) {
		if (compareProperties && compareProperties.length >= 10) {
			return true;
		}
		return false;
	}
}
