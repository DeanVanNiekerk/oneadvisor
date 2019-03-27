export type ColumnType =
    | "string"
    | "date"
    | "long-date"
    | "boolean"
    | "currency";

export type FilterOptions = {
    text: string;
    value: string;
};

export type ColumnOptions = {
    type?: ColumnType;
    render?: (value: any, record: any, index: number) => any;
    sorter?: ((a: any, b: any) => any) | boolean;
    onFilter?: (value: string, record: any, property: string) => boolean;
    filters?: FilterOptions[];
    showSearchFilter?: boolean;
    externalDataSource?: boolean;
    fixed?: "left" | "right";
    width?: string | number;
    align?: "left" | "right" | "center";
};

export interface PagedItems<T> {
    totalItems: number;
    items: Array<T>;
}

export type PageOptions = {
    number: number;
    size: number;
};

export type SortDirection = "asc" | "desc";

export type SortOptions = {
    direction: SortDirection;
    column: string;
};

export type Filters = Record<string, string[]>;
