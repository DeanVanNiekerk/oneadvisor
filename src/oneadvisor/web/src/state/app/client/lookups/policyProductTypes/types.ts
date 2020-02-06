export type PolicyProductType = {
    id: string;
    policyTypeId: string;
    name: string;
    code: string;
};

export type PolicyProductTypeEdit = {
    id: string | null;
    policyTypeId: string;
    name: string;
    code: string;
};
