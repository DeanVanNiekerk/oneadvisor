import queryString from 'query-string';

import { PageOptions, SortOptions } from '@/app/types';

export const appendPageOptionQuery = (
    api: string,
    options: PageOptions
): string => {
    const query = {
        pageNumber: options.number,
        pageSize: options.size
    };

    return appendQueryString(api, query);
};

export const appendSortOptionQuery = (
    api: string,
    options: SortOptions
): string => {
    const query = {
        sortColumn: options.column,
        sortDirection: options.direction
    };

    return appendQueryString(api, query);
};

export const appendQueryString = (url: string, params: any): string => {
    const parsed = queryString.parseUrl(url);

    const query = {
        ...parsed.query,
        ...params
    };

    return `${parsed.url}?${queryString.stringify(query)}`;
};
