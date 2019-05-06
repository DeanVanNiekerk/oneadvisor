import moment from 'moment';

import { ColumnOptions, Filters } from '@/app/table';
import { getColumnSearchProps } from '@/ui/controls';

import { formatCurrency } from '../utils';

const columnOptionDefaults: ColumnOptions = {
    type: "string",
    render: value => value,
};

export const getColumnEDS = (
    key: string,
    title: string,
    options: ColumnOptions = {},
    filters: Filters | null = null
) => {
    return getColumn(
        key,
        title,
        {
            ...options,
            externalDataSource: true,
        },
        filters
    );
};

export const getColumn = (
    key: string,
    title: string,
    options: ColumnOptions = {},
    filters: Filters | null = null
) => {
    const data = {
        title: title,
        dataIndex: key,
        key: key,
    };

    options = {
        ...columnOptionDefaults,
        sorter: (a: any, b: any) => sort(a, b, key),
        onFilter: (value: string, record: any) => filter(value, record, key),
        ...options,
    };

    if (options.externalDataSource) {
        if (options.sorter) options.sorter = () => {};
        options.onFilter = undefined;
    }

    if (options.type === "boolean")
        options.render = value => (value ? "Yes" : "No");

    if (options.type === "date")
        options.render = value => (value ? moment(value).format("ll") : "");

    if (options.type === "long-date")
        options.render = value => (value ? moment(value).format("lll") : "");

    if (options.type === "currency")
        options.render = value => formatCurrency(value);

    if (options.showSearchFilter) {
        options = {
            ...options,
            ...getColumnSearchProps(title),
        };
    }

    if (filters) {
        let filter = filters[key];
        if (filter && filter.length > 0)
            options = {
                ...options,
                filtered: true,
                filteredValue: filter,
            };
    }

    return {
        ...data,
        ...options,
    };
};

export const sort = (item1: any, item2: any, property: string) => {
    const val1 = item1[property] ? item1[property] : "";
    const val2 = item2[property] ? item2[property] : "";

    if (typeof val1 === "number") return val1 - val2;

    return val1.toString().localeCompare(val2);
};

export const filter = (value: string, record: any, property: string) => {
    return record[property].toLowerCase().indexOf(value.toLowerCase()) !== -1;
};
