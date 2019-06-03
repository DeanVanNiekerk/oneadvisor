import config from '@/config/config';

const commissionBaseApi = `${config.baseApi}/api/commission`;

export const commissionsApi = `${commissionBaseApi}/commissions`;
export const statementsApi = `${commissionBaseApi}/statements`;
export const commissionsImportApi = `${commissionBaseApi}/import/excel`;
export const statementTemplatesApi = `${statementsApi}/templates`;
export const commissionReportsApi = `${commissionBaseApi}/report`;
export const allocationsApi = `${commissionBaseApi}/allocations`;
export const splitRulesApi = `${commissionBaseApi}/splitRules`;

export const commissionLookupsApi = `${commissionBaseApi}/lookups`;
export const allCommissionLookupsApi = `${commissionLookupsApi}/all`;
export const commissionTypesApi = `${commissionLookupsApi}/commissionTypes`;
