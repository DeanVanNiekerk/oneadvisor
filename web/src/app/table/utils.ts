import moment from 'moment';

import { ColumnOptions } from '@/app/table';
import { getColumnSearchProps } from '@/ui/controls';

const columnOptionDefaults: ColumnOptions = {
    type: 'string',
    render: value => value
};

export const getColumn = (
    key: string,
    title: string,
    options: ColumnOptions = {}
) => {
    const data = {
        title: title,
        dataIndex: key,
        key: key
    };

    options = {
        ...columnOptionDefaults,
        sorter: (a: any, b: any) => sort(a, b, key),
        onFilter: (value: string, record: any) => filter(value, record, key),
        ...options
    };

    if (options.type === 'boolean')
        options.render = value => (value ? 'Yes' : 'No');

    if (options.type === 'date')
        options.render = value => (value ? moment(value).format('ll') : '');

    if (options.type === 'long-date')
        options.render = value => (value ? moment(value).format('lll') : '');

    if (options.type === 'currency')
        options.render = value =>
            !value
                ? ''
                : `R ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

    if (options.showSearchFilter) {
        options = {
            ...options,
            ...getColumnSearchProps(title)
        };
    }

    return {
        ...data,
        ...options
    };
};

export const sort = (item1: any, item2: any, property: string) => {
    const val1 = item1[property] ? item1[property] : '';
    const val2 = item2[property] ? item2[property] : '';
    return val1.localeCompare(val2);
};

export const filter = (value: string, record: any, property: string) => {
    return record[property].toLowerCase().indexOf(value.toLowerCase()) !== -1;
};
