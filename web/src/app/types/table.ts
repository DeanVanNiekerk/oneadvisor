export type PagedItems<T> = {
    totalItems: number;
    items: Array<T>;
};

export type PageOptions = {
    number: number;
    size: number;
};

export type SortDirection = 'asc' | 'desc';

export type SortOptions = {
    direction: SortDirection;
    column: string;
};
