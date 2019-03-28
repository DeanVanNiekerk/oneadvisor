import config from '@/config/config';

const clientBaseApi = `${config.baseApi}/api/client`;

export const clientsApi = `${clientBaseApi}/clients`;
export const clientsImportApi = `${clientBaseApi}/import`;
export const clientsExportApi = `${clientBaseApi}/export`;
export const policiesApi = `${clientBaseApi}/policies`;
export const contactsApi = `${clientBaseApi}/contacts`;
export const mergeApi = `${clientBaseApi}/merge`;
