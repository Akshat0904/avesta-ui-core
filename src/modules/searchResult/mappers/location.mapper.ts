import { CommonHelpers, ILocation, IProjectDetailUrlFromData } from '@realestateview/avesta-js-core';
import { ELocationGroupId } from '@searchResult/types/enums';

export class LocationMapper {
	static toLocations(raw: any[], includeCityLga?: boolean): ILocation[] {
		return raw.reduce((acc: ILocation[], item: any) => {
			const locationData = item?.value && this.getLocationData(item.groupId, item.value, includeCityLga);
			return locationData ? [...acc, locationData] : acc;
		}, []);
	}

	private static getLocationData(groupId: string, selectedLocation: any, includeCityLga?: boolean): ILocation | null {
		const baseLocation: ILocation = {
			state:
				groupId === ELocationGroupId.SCHOOL
					? selectedLocation.state_code
						? selectedLocation.state_code.toLowerCase()
						: selectedLocation.state.toLowerCase()
					: selectedLocation.state.toLowerCase()
		};

		const locationMap: { [key: string]: (loc: any) => Partial<ILocation> } = {
			school: this.getSchoolData,
			city: this.getCityData,
			lga: this.getLgaData,
			street: this.getStreetData,
			project: this.getProjectData
		};
		const specificData = locationMap[groupId]?.(selectedLocation) || {};
		const defaultData = this.getDefaultData(selectedLocation, groupId, includeCityLga);

		return { ...baseLocation, ...defaultData, ...specificData };
	}

	private static getSchoolData(loc: any): Partial<ILocation> {
		return {
			suburbName: loc.suburb ?? loc.suburbName,
			postcode: loc.postcode || '',
			schoolName: loc.full_name ?? loc.schoolName,
			schoolNameSlug: loc.schoolNameSlug || '',
			suburbNameSlug: (loc.suburbNameSlug ?? loc.suburbSlug) || ''
		};
	}

	private static getCityData(loc: any): Partial<ILocation> {
		return {
			city: loc.city,
			citySlug: CommonHelpers.slugify(loc.city || '')
		};
	}

	private static getLgaData(loc: any): Partial<ILocation> {
		return {
			lgaName: loc.lgaName,
			lgaSlug: CommonHelpers.slugify(loc.lgaName || '')
		};
	}

	private static getStreetData(loc: any): Partial<ILocation> {
		return {
			suburbNameSlug: CommonHelpers.slugify(loc.suburbName || ''),
			suburbName: loc.suburbName,
			postcode: loc.postcode,
			streetName: loc.streetName,
			streetNameSlug: CommonHelpers.slugify(loc.streetName || '')
		};
	}

	private static getProjectData(loc: any): Partial<IProjectDetailUrlFromData> {
		return {
			suburbName: loc.suburbName,
			postcode: loc.postcode,
			projectSlug: loc.projectSlug
		};
	}

	private static getDefaultData(loc: any, groupId: string, includeCityLga?: boolean): Partial<ILocation> {
		if (groupId === ELocationGroupId.LGA || groupId === ELocationGroupId.STATE || groupId === ELocationGroupId.CITY)
			return {};
		const result: Partial<ILocation> = {
			suburbNameSlug: CommonHelpers.slugify(loc.suburbName || ''),
			suburbName: loc.suburbName,
			postcode: loc.postcode
		};

		if ('streetName' in loc) result.streetName = loc.streetName;
		if ('streetSlug' in loc) result.streetNameSlug = loc.streetSlug;

		if (includeCityLga) {
			if ('city' in loc && loc.city) result.city = loc.city;
			if ('lgaName' in loc && loc.lgaName) result.lgaName = loc.lgaName;
		}

		return result;
	}
}
