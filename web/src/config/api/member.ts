import config from '@/config/config';

const memberBaseApi = `${config.baseApi}/api/member`;

export const membersApi = `${memberBaseApi}/members`;
export const membersImportApi = `${memberBaseApi}/import`;
export const membersExportApi = `${memberBaseApi}/export`;
export const policiesApi = `${memberBaseApi}/policies`;
export const contactsApi = `${memberBaseApi}/contacts`;
export const mergeApi = `${memberBaseApi}/merge`;
