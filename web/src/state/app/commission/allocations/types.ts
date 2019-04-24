export type Allocation = {
    id: string;
    fromClientId: string;
    toClientId: string;
    policyIds: string[];
};

export type AllocationEdit = {
    id: string;
    fromClientId: string;
    toClientId: string;
    policyIds: string[];
};
