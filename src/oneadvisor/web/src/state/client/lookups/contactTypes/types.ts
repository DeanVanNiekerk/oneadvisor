export type ContactType = {
    id: string;
    name: string;
};

export type ContactTypesListState = {
    readonly items: ContactType[];
};

export type ContactTypesState = {
    readonly list: ContactTypesListState;
};
