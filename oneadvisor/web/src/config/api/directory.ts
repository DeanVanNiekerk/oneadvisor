import config from '@/config/config';

const directoryBaseApi = `${config.baseApi}/api/directory`;

export const identityApi = `${directoryBaseApi}/identity`;
export const usersApi = `${directoryBaseApi}/users`;
export const organisationsApi = `${directoryBaseApi}/organisations`;
export const rolesApi = `${directoryBaseApi}/roles`;
export const applicationsApi = `${directoryBaseApi}/applications`;
export const useCasesApi = `${directoryBaseApi}/usecases`;
export const branchesApi = `${directoryBaseApi}/branches`;
export const auditApi = `${directoryBaseApi}/audit`;

export const directoryLookupsApi = `${directoryBaseApi}/lookups`;
export const allDirectoryLookupsApi = `${directoryLookupsApi}/all`;
export const companiesApi = `${directoryLookupsApi}/companies`;
