import { IncomingMessage } from 'http';

export const checkDeviceIsMobileByUserAgent = (userAgent: string) => {
	return Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
};

export const getUserIpAddressFromRequest = (req: IncomingMessage) => {
	let ipAddress;

	if (req.headers['x-forwarded-for']) {
		ipAddress = req.headers['x-forwarded-for'] as string;
		ipAddress = ipAddress.split(',')[0];
	}

	if (!ipAddress) {
		ipAddress = req.socket.remoteAddress;
	}

	return ipAddress || '0.0.0.0';
};
