import { EToastMsg } from '../types/enums';

export interface IToasterService {
	customToaster(message: EToastMsg | any, severity: 'success' | 'error' | 'warning' | 'info'): void;
}
