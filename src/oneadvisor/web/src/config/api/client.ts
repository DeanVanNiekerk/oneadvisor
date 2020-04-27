import config from "@/config/config";

const clientBaseApi = `${config.baseApi}/api/client`;

export const clientsApi = `${clientBaseApi}/clients`;
export const clientsImportApi = `${clientBaseApi}/import`;
export const clientsExportApi = `${clientBaseApi}/export`;
export const policiesApi = `${clientBaseApi}/policies`;
export const contactsApi = `${clientBaseApi}/contacts`;
export const mergeClientsApi = `${clientBaseApi}/merge/clients`;

export const clientLookupsApi = `${clientBaseApi}/lookups`;
export const allClientLookupsApi = `${clientLookupsApi}/all`;
export const policyProductTypesApi = `${clientLookupsApi}/policyProductTypes`;
export const policyProductsApi = `${clientLookupsApi}/policyProducts`;
export const mergePoliciesApi = `${clientBaseApi}/merge/policies`;
export const policyTypeCharacteristicsApi = `${clientLookupsApi}/policyTypeCharacteristics`;
