import { ColumnProps } from "antd/lib/table";
import moment from "moment";

import { ColumnOptions, Filters } from "@/app/table";
import { getColumnSearchProps } from "@/ui/controls";

import { formatCurrency } from "../utils";

export const getColumnDefinition = <T = any>(externalDataSource: boolean = false, filters: Filters | null = null) => {
    return (key: keyof T | "", title: string, options: ColumnOptions = {}, columnProps: ColumnProps<T> = {}) => {
        options = {
            externalDataSource: externalDataSource,
            filters: filters,
            ...options,
        };
        return getColumn<T>(key, title, options, columnProps);
    };
};

const getColumn = <T>(
    key: keyof T | "",
    title: string,
    options: ColumnOptions = {
        type: "string",
        externalDataSource: false,
        showSearchFilter: false,
        filters: null,
    },
    columnProps: ColumnProps<T> = {}
): ColumnProps<T> => {
    const keyString = key.toString();

    const data = {
        title: title,
        dataIndex: keyString,
        key: keyString,
    };

    let props: ColumnProps<T> = {
        render: value => value,
        sorter: (a: any, b: any) => sort(a, b, keyString),
        onFilter: (value: string, record: any) => filter(value, record, keyString),
        ...columnProps,
    };

    // if (options.externalDataSource) {
    //     props.sorter = true;
    //     props.onFilter = undefined;
    // }

    if (options.type === "boolean") props.render = formatBool;
    if (options.type === "date") props.render = value => (value ? moment(value).format("ll") : "");
    if (options.type === "long-date") props.render = value => (value ? moment(value).format("lll") : "");
    if (options.type === "currency") props.render = value => formatCurrency(value, 0);

    if (options.showSearchFilter) {
        props = {
            ...props,
            ...getColumnSearchProps<T>(title),
        };
    }

    if (options.filters) {
        let filter = options.filters[keyString];
        if (filter && filter.length > 0)
            props = {
                ...props,
                filteredValue: filter,
            };
    }

    return {
        ...data,
        ...props,
    };
};

export const sort = (item1: any, item2: any, property: string) => {
    const val1 = item1[property] ? item1[property] : "";
    const val2 = item2[property] ? item2[property] : "";

    if (typeof val1 === "number") return val1 - val2;

    return val1.toString().localeCompare(val2);
};

export const filter = (value: string, record: any, property: string) => {
    return record[property].toString().toLowerCase().indexOf(value.toString().toLowerCase()) !== -1;
};

export const formatBool = (value: boolean) => {
    return value ? "Yes" : "No";
};
