import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PagedItems } from "@/app/table";
import { ApiAction } from "@/app/types";
import { policiesApi } from "@/config/api/client";

import { Policy } from "../types";

type PolicySearchReceiveAction = {
    type: "POLICIES_SEARCH_RECEIVE";
    payload: PagedItems<Policy>;
};
type PolicySearchFetchingAction = { type: "POLICIES_SEARCH_FETCHING" };
type PolicySearchFetchingErrorAction = {
    type: "POLICIES_SEARCH_FETCHING_ERROR";
};

export type PolicySearchAction =
    | PolicySearchReceiveAction
    | PolicySearchFetchingAction
    | PolicySearchFetchingErrorAction;

export const searchPolicies = (filters: Filters): ApiAction => {
    let api = policiesApi;
    api = appendPageOptionQuery(api, {
        number: 1,
        size: 10,
    });
    api = appendSortOptionQuery(api, {
        column: "number",
        direction: "asc",
    });
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "POLICIES_SEARCH",
    };
};
