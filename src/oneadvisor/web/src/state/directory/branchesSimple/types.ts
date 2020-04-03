export type BranchSimple = {
    id: string;
    name: string;
};

export type ListState = {
    readonly items: BranchSimple[];
    readonly fetching: boolean;
};

export type BranchesSimpleState = {
    readonly list: ListState;
};
