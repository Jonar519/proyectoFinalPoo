import { environment } from '../../../environments/environment';

const base = environment.apiBaseUrl.replace(/\/$/, '');
export const API_V1 = base ? `${base}/api/v1` : '/api/v1';
