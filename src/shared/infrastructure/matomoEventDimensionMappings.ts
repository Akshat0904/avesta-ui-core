import { TMatomoDimensions } from '../types/matomo';

const dimensionMapping: Record<string, string> = {
	listingId_GnafId: 'dimension1',
	listingType: 'dimension2',
	tierType: 'dimension3',
	agencyId: 'dimension4',
	agentId: 'dimension5',
	state: 'dimension6',
	city: 'dimension7',
	lgaName: 'dimension8',
	suburb: 'dimension9',
	bedroom: 'dimension10',
	bathroom: 'dimension11',
	carpark: 'dimension12',
	propertyType: 'dimension13',
	sa1Code: 'dimension14',
	imageSource: 'dimension15',
	dateTime: 'dimension16',
	postCode: 'dimension17',
	name: 'dimension18',
	phone: 'dimension19',
	email: 'dimension20',
	message: 'dimension21',
	checkBoxes: 'dimension22',
	propertyTypeMul: 'dimension23',
	searchKeyword: 'dimension24',
	lowerPrice: 'dimension25',
	upperPrice: 'dimension26',
	includeSurrSuburb: 'dimension27',
	domainName: 'dimension28',
	isOwner: 'dimension29',
	suburbMul: 'dimension30',
	category: 'dimension31',
	author: 'dimension32',
	gender: 'dimension33',
	dob: 'dimension34',
	bestDescribes: 'dimension35',
	userAction: 'dimension36',
	emailFrequency: 'dimension37',
	section: 'dimension38',
	pageNo: 'dimension39',
	sortBy: 'dimension40',
	pageName: 'dimension41',
	articleId: 'dimension42',
	bizCategory: 'dimension43',
	bizSubCategory: 'dimension44',
	searchWithin: 'dimension45',
	minLandArea: 'dimension46',
	maxLandArea: 'dimension47',
	bedroomRange: 'dimension48',
	bathroomRange: 'dimension49',
	carparkRange: 'dimension50',
	street: 'dimension51',
	features: 'dimension52',
	listingTypeMul: 'dimension53',
	schoolName: 'dimension54',
	landSize: 'dimension55',
	isReipListing: 'dimension56',
	isReipAgency: 'dimension57',
	acid: 'dimension62'
};
export const mapEventDimensions = (args: TMatomoDimensions): Record<string, any> => {
	const result: Record<string, any> = {};

	for (let i = 1; i <= 75; i++) {
		const dimKey = `dimension${i}`;

		const originalKey = Object.keys(dimensionMapping).find((key) => dimensionMapping[key] === dimKey);

		const argsKey = args[originalKey as keyof TMatomoDimensions];

		if (originalKey === 'includeSurrSuburb') {
			if (argsKey !== undefined && argsKey !== null) {
				result[dimKey] = argsKey;
			}
		} else if (originalKey && Boolean(argsKey)) {
			result[dimKey] = argsKey;
		}
	}

	return result;
};
