import { string } from 'prop-types';

import { filter, Filters, PageOptions, SortOptions } from '@/app/table';

export const appendPageOptionQuery = (
    api: string,
    options: PageOptions
): string => {
    const query: Param[] = [
        {
            key: 'pageNumber',
            value: options.number.toString()
        },
        {
            key: 'pageSize',
            value: options.size.toString()
        }
    ];

    return appendQueryString(api, query);
};

export const appendSortOptionQuery = (
    api: string,
    options: SortOptions
): string => {
    const query: Param[] = [
        {
            key: 'sortColumn',
            value: options.column
        },
        {
            key: 'sortDirection',
            value: options.direction
        }
    ];

    return appendQueryString(api, query);
};

export const appendFiltersQuery = (api: string, filters: Filters): string => {
    if (!filters) return api;

    let filtersValues: string[] = [];

    Object.keys(filters).forEach(key => {
        const values = filters[key];
        if (values.length > 0) filtersValues.push(`${key}=${values.join(',')}`);
    });

    if (filtersValues.length === 0) return api;

    const query: Param[] = [
        {
            key: 'filters',
            value: filtersValues.join(';')
        }
    ];

    return appendQueryString(api, query);
};

export const appendQueryString = (url: string, params: Param[]): string => {
    const parsed = parseUrl(url);
    parsed.params = parsed.params.concat(params);
    return formatUrl(parsed);
};

type Param = {
    key: string;
    value: string;
};

type Url = {
    base: string;
    params: Param[];
};

const parseUrl = (input: string): Url => {
    var split = input.split('?');

    const url: Url = {
        base: split[0],
        params: []
    };

    if (split.length === 1) return url;

    const params = split[1].split('&');

    params.forEach(p => {
        const param = p.split('=');

        if (param.length < 2) return;

        url.params.push({
            key: param[0],
            value: param[1]
        });
    });

    return url;
};

const formatUrl = (input: Url): string => {
    let url = input.base;

    if (input.params.length > 0) {
        const query = input.params.map(p => {
            return `${p.key}=${encodeURIComponent(p.value)}`;
        });
        url = `${url}?${query.join('&')}`;
    }

    return url;
};
