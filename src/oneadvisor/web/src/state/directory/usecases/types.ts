export type UseCase = {
    id: string;
    name: string;
    applicationId: string;
};

export type ListState = {
    readonly items: UseCase[];
    readonly fetching: boolean;
};

export type UseCasesState = {
    readonly list: ListState;
};
