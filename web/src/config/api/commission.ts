import config from '@/config/config';

const commissionBaseApi = `${config.baseApi}/api/commission`;

export const commissionsApi = `${commissionBaseApi}/commissions`;
export const statementsApi = `${commissionBaseApi}/statements`;
export const commissionsImportApi = `${commissionBaseApi}/import/excel`;
export const statementTemplatesApi = `${statementsApi}/templates`;
