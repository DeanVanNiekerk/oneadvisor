export const UNKNOWN_COMMISSION_TYPE_CODE = 'unknown';

export type CommissionType = {
    id: string;
    policyTypeId: string;
    name: string;
    code: string;
};
