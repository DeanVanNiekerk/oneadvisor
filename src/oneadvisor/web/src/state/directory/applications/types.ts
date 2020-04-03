export type Application = {
    id: string;
    name: string;
    colourHex: string;
};

export type ApplicationsState = {
    readonly list: ListState;
};

export type ListState = {
    readonly items: Application[];
    readonly fetching: boolean;
};
