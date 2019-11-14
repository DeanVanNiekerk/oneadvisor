import { Filters, PageOptions, SortOptions } from "@/app/table";

export const appendPageOptionQuery = (api: string, options: PageOptions): string => {
    const query: Param[] = [
        {
            key: "pageNumber",
            value: options.number.toString(),
        },
        {
            key: "pageSize",
            value: options.size.toString(),
        },
    ];

    return appendQueryString(api, query);
};

export const appendSortOptionQuery = (api: string, options: SortOptions): string => {
    const query: Param[] = [
        {
            key: "sortColumn",
            value: options.column ? options.column : "",
        },
        {
            key: "sortDirection",
            value: options.direction ? options.direction : "",
        },
    ];

    return appendQueryString(api, query);
};

export const appendFiltersQuery = (api: string, filters: Filters | null): string => {
    if (!filters) return api;

    const filtersValues: string[] = [];

    Object.keys(filters).forEach(key => {
        const values = cleanValues(filters[key]);
        if (values.length > 0) filtersValues.push(`${key}=${values.join(",")}`);
    });

    if (filtersValues.length === 0) return api;

    const query: Param[] = [
        {
            key: "filters",
            value: filtersValues.join(";"),
        },
    ];

    return appendQueryString(api, query);
};

const cleanValues = (values: string[] | undefined): string[] => {
    if (!values) return [];
    return values.map(v => cleanValue(v));
};

const cleanValue = (values: string): string => {
    return values
        .replace("=", "")
        .replace(",", "")
        .replace(";", "");
};

export const appendQueryString = (url: string, params: Param[]): string => {
    const parsed = parseUrl(url);
    parsed.params = parsed.params.concat(params);
    return formatUrl(parsed);
};

export const applyLike = (filters: Filters | null, fieldNames: string[]): Filters => {
    if (!filters) return {};

    const newFilters: Filters = {};
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (!value) return;

        newFilters[key] = value.map(f => {
            if (fieldNames.indexOf(key) !== -1) return applyLikeFormat(f);
            return f;
        });
    });

    return newFilters;
};

export const applyLikeFormat = (value: string): string => {
    return `%${value}%`;
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
    const split = input.split("?");

    const url: Url = {
        base: split[0],
        params: [],
    };

    if (split.length === 1) return url;

    const params = split[1].split("&");

    params.forEach(p => {
        const param = p.split("=");

        if (param.length < 2) return;

        url.params.push({
            key: param[0],
            value: param[1],
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
        url = `${url}?${query.join("&")}`;
    }

    return url;
};
