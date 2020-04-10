import { appendFiltersQuery } from "@/app/query";
import { PagedItems } from "@/app/table";
import { ApiAction, ApiOnSuccess } from "@/app/types";
import { organisationsApi } from "@/config/api/directory";

import { Organisation, OrganisationsFilters } from "../types";

type OrganisationListReceiveAction = {
    type: "ORGANISATIONS_LIST_RECEIVE";
    payload: PagedItems<Organisation>;
};
type OrganisationListFetchingAction = { type: "ORGANISATIONS_LIST_FETCHING" };
type OrganisationListFetchingErrorAction = {
    type: "ORGANISATIONS_LIST_FETCHING_ERROR";
};

export type OrganisationListAction =
    | OrganisationListReceiveAction
    | OrganisationListFetchingAction
    | OrganisationListFetchingErrorAction;

export const fetchOrganisations = (filters?: OrganisationsFilters): ApiAction => {
    let api = organisationsApi;
    if (filters) api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "ORGANISATIONS_LIST",
    };
};

export const getOrganisations = (
    filters: OrganisationsFilters,
    onSuccess: ApiOnSuccess<PagedItems<Organisation>>
): ApiAction => {
    let api = organisationsApi;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        onSuccess: onSuccess,
    };
};
