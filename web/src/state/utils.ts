import moment from 'moment';

type ColumnType = 'string' | 'date';

type ColumnOptions = {
    type?: ColumnType,
    render?: (value: any) => any,
    sorter?: (a: any, b: any) => any
};

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
        ...options
    };

    if (options.type === 'date')
        options.render = value => (value ? moment(value).format('lll') : '');

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
