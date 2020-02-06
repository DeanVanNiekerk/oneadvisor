export const UNKNOWN_COMMISSION_TYPE_CODE = "unknown";

export type CommissionType = {
    id: string;
    policyTypeId: string;
    commissionEarningsTypeId: string;
    name: string;
    code: string;
};

export type CommissionTypeEdit = {
    id: string | null;
    policyTypeId: string;
    commissionEarningsTypeId: string;
    name: string;
    code: string;
};
