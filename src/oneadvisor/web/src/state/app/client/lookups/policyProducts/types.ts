export type PolicyProduct = {
    id: string;
    policyProductTypeId: string;
    companyId: string;
    name: string;
    code: string;
};

export type PolicyProductEdit = {
    id: string | null;
    policyProductTypeId: string;
    companyId: string;
    name: string;
    code: string;
};
