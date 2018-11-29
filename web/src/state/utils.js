// @flow

export const getColumn = (key: string, title: string) => ({
    title: title,
    dataIndex: key,
    key: key,
    sorter: (a: any, b: any) => sort(a, b, key)
});

export const sort = (item1: any, item2: any, property: string) =>
    item1[property].localeCompare(item2[property]);
