export const BROKER_USER_TYPE_ID = "70a67bcf-f8d3-8fe7-9c3e-b4b8b9bf9cc8";

export type UserType = {
    id: string;
    name: string;
    displayOrder: number;
};

export type UserTypeListState = {
    readonly items: UserType[];
};

export type UserTypesState = {
    readonly list: UserTypeListState;
};
