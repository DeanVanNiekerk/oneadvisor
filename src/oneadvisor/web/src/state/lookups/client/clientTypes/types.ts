export type ClientType = {
    id: string;
    name: string;
    code: string;
};

export type ClientTypeListState = {
    readonly items: ClientType[];
};

export type ClientTypesState = {
    readonly list: ClientTypeListState;
};
