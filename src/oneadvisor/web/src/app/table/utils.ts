import { ColumnProps } from "antd/lib/table";
import moment from "moment";

import { ColumnOptions, Filters } from "@/app/table";

import { formatCurrency } from "../utils";
import { SortOptions } from "./types";

export const getColumnDefinition = <T>(
    externalDataSource = false,
    filters: Filters | null = null,
    sortOptions: SortOptions | null = null
) => {
    return (
        dataIndex: keyof T | "",
        title: string,
        options: ColumnOptions = {},
        columnProps: ColumnProps<T> = {}
    ) => {
        options = {
            externalDataSource: externalDataSource,
            filters: filters,
            ...options,
        };

        if (sortOptions && sortOptions.column === dataIndex) {
            columnProps.defaultSortOrder = sortOptions.direction === "asc" ? "ascend" : "descend";
        }

        return getColumn<T>(dataIndex, title, options, columnProps);
    };
};

const getColumn = <T>(
    dataIndex: keyof T | "",
    title: string,
    options: ColumnOptions = {
        type: "string",
        externalDataSource: false,
        filters: null,
    },
    columnProps: ColumnProps<T> = {}
): ColumnProps<T> => {
    const dataIndexString = dataIndex.toString();

    const data = {
        title: title,
        dataIndex: dataIndexString,
        key: options.key ? options.key : dataIndexString,
    };

    let props: ColumnProps<T> = {
        render: (value) => value,
        sorter: (a: T, b: T) => sort<T>(a, b, dataIndexString),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFilter: (value: any, record: T) => filter(value, record, dataIndexString),
        ...columnProps,
    };

    if (options.externalDataSource) {
        props.sorter = true;
        props.onFilter = undefined;
    }

    if (options.type === "boolean") props.render = formatBool;
    if (options.type === "date")
        props.render = (value) => (value ? moment(value).format("ll") : "");
    if (options.type === "long-date")
        props.render = (value) => (value ? moment(value).format("lll") : "");
    if (options.type === "currency") props.render = (value) => formatCurrency(value, 0);
    if (options.type === "long-currency") props.render = (value) => formatCurrency(value, 2);

    if (options.filters) {
        const filter = options.filters[dataIndexString];
        if (filter && filter.length > 0)
            props = {
                ...props,
                filteredValue: filter,
            };
    }

    if (columnProps.sorter === false) delete props.sorter;

    return {
        ...data,
        ...props,
    };
};

export const sort = <T>(item1: T, item2: T, property: string): number => {
    const val1 = item1[property] ? item1[property] : "";
    const val2 = item2[property] ? item2[property] : "";

    if (typeof val1 === "number") return val1 - val2;

    return val1.toString().localeCompare(val2);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filter = <T>(value: any, record: T, property: string): boolean => {
    return record[property].toString().toLowerCase().indexOf(value.toString().toLowerCase()) !== -1;
};

export const formatBool = (value: boolean) => {
    return value ? "Yes" : "No";
};
