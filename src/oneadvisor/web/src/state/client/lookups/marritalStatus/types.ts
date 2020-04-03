export type MarritalStatus = {
    id: string;
    name: string;
};

export type MarritalStatusListState = {
    readonly items: MarritalStatus[];
};

export type MarritalStatusState = {
    readonly list: MarritalStatusListState;
};
