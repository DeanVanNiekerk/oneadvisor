export type Allocation = {
    id: string;
    fromClientId: string;
    toClientId: string;
    policyIdCount: number;
    fromClientFirstName: string;
    fromClientLastName: string;
};

export type AllocationEdit = {
    id: string | null;
    fromClientId: string | null;
    toClientId: string;
    policyIds: string[];
};
