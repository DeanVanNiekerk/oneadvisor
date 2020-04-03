export type UserSimple = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    branchId: string;
    userTypeId: string;
};

export type ListState = {
    readonly totalItems: number;
    readonly items: UserSimple[];
    readonly fetching: boolean;
};

export type UserSimpleState = {
    readonly userSimple: UserSimple | null;
    readonly fetching: boolean;
};

export type UsersSimpleState = {
    readonly list: ListState;
    readonly userSimple: UserSimpleState;
};
