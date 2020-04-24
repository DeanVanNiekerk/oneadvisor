export type PolicyType = {
    id: string;
    name: string;
    code: string;
};

export type PolicyTypeListState = {
    readonly items: PolicyType[];
};

export type PolicyTypesState = {
    readonly list: PolicyTypeListState;
};
