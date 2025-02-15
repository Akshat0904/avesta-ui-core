export enum EModuleType {
	HOME = 'HOME',
	PROJECT = 'PROJECT',
	SCHOOL = 'SCHOOL'
}

export enum ESaveSearchFrequency {
	daily = 'Daily',
	weekly = 'Weekly'
}

export enum EAlertTypes {
	ofi = 'OFI',
	list = 'LIST',
	auction = 'AUCTION'
}

export enum ELocationTypes {
	suburb = 'suburb',
	lgaName = 'lgaName',
	city = 'city',
	state = 'state',
	street = 'street'
}

export enum ELocationGroupId {
	STATE = 'state',
	CITY = 'city',
	SUBURB = 'suburb',
	LGA = 'lga',
	STREET = 'street',
	PROPERTY = 'property',
	PROJECT = 'project',
	SCHOOL = 'school'
}

export enum EListingRank {
	Standard = 'Standard',
	Basic = 'Basic',
	Premium = 'Premium',
	Feature = 'Feature'
}

export enum EPropertyImageSource {
	REV = 'REV',
	CORELOGIC = 'CORELOGIC',
	GOOGLE = 'GOOGLE',
	NONE = 'NONE',
	NEARMAP = 'NEARMAP'
}

export enum EGridLevel {
	large = 'large',
	medium = 'medium',
	small = 'small'
}
