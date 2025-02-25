export const validateDecimalNumber = (value: string) => {
	const sanitizedValue = value.replace(/[^0-9.]/g, '');

	const normalizedValue = sanitizedValue.startsWith('.') ? `0${sanitizedValue}` : sanitizedValue;

	if ((normalizedValue.match(/\./g) || []).length > 1) {
		return normalizedValue.replace(/\.(?=.*\.)/g, '');
	}

	const parts = normalizedValue.split('.');
	if (parts[1] && parts[1].length > 2) {
		return parts[0] + '.' + parts[1].slice(0, 2);
	}

	return normalizedValue;
};
