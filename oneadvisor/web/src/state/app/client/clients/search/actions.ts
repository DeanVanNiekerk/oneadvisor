import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PagedItems } from "@/app/table";
import { ApiAction } from "@/app/types";
import { clientsApi } from "@/config/api/client";

import { Client } from "../types";

type ClientSearchReceiveAction = {
    type: "CLIENTS_SEARCH_RECEIVE";
    payload: PagedItems<Client>;
};
type ClientSearchFetchingAction = { type: "CLIENTS_SEARCH_FETCHING" };
type ClientSearchFetchingErrorAction = {
    type: "CLIENTS_SEARCH_FETCHING_ERROR";
};

export type ClientSearchAction =
    | ClientSearchReceiveAction
    | ClientSearchFetchingAction
    | ClientSearchFetchingErrorAction;

export const searchClients = (filters: Filters): ApiAction => {
    let api = clientsApi;
    api = appendPageOptionQuery(api, {
        number: 1,
        size: 100,
    });
    api = appendSortOptionQuery(api, {
        column: "lastName",
        direction: "asc",
    });
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "CLIENTS_SEARCH",
    };
};
