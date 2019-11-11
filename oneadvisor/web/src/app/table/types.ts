export type ColumnType = "string" | "date" | "long-date" | "boolean" | "currency";

export type FilterOptions = {
    text: string;
    value: string;
};

export type ColumnOptions = {
    type?: ColumnType;
    externalDataSource?: boolean;
    filters?: Filters | null;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Filters<T = any> = { [key in keyof T]?: string[] };
