export type ColumnType =
    | 'string'
    | 'date'
    | 'long-date'
    | 'boolean'
    | 'currency';

export type FilterOptions = {
    text: string;
    value: string;
};

export type ColumnOptions = {
    type?: ColumnType;
    render?: (value: any, record: any, index: number) => any;
    sorter?: (a: any, b: any) => any;
    onFilter?: (value: string, record: any, property: string) => boolean;
    filters?: FilterOptions[];
    showSearchFilter?: boolean;
};

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

export type Filters = Record<string, string[]>;
