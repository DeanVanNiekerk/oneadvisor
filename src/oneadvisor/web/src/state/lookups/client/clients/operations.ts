import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction, ApiOnAlways, ApiOnSuccess } from "@/app/types";
import { clientsApi } from "@/config/api/client";
import { Client, ClientEdit } from "@/state/client/clients/types";

export const getClient = (clientId: string, onSuccess: ApiOnSuccess<ClientEdit>): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}/${clientId}`,
    onSuccess: onSuccess,
});

export const getClients = (
    filters: Filters = {},
    pageOptions?: PageOptions,
    sortOptions?: SortOptions,
    onSuccess?: ApiOnSuccess<PagedItems<Client>>,
    onAlways?: ApiOnAlways
): ApiAction => {
    let api = clientsApi;

    if (pageOptions) api = appendPageOptionQuery(api, pageOptions);
    if (sortOptions) api = appendSortOptionQuery(api, sortOptions);

    api = appendFiltersQuery(api, filters);

    return {
        type: "API",
        endpoint: api,
        onSuccess: onSuccess,
        onAlways: onAlways,
    };
};
