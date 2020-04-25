export type BranchSimple = {
    id: string;
    name: string;
};

export type BranchesSimpleListState = {
    readonly items: BranchSimple[];
    readonly fetching: boolean;
};

export type BranchesSimpleState = {
    readonly list: BranchesSimpleListState;
};
