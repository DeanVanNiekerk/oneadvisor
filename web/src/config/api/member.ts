import config from '@/config/config';

const memberBaseApi = `${config.baseApi}/api/member`;

export const membersApi = `${memberBaseApi}/members`;
export const membersImportApi = `${memberBaseApi}/import`;
export const policiesApi = `${memberBaseApi}/policies`;
