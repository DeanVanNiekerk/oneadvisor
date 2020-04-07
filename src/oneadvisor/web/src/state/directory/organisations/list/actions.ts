import { PagedItems } from "@/app/table";
import { ApiAction, ApiOnSuccess } from "@/app/types";
import { organisationsApi } from "@/config/api/directory";

import { Organisation } from "../types";

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

export const fetchOrganisations = (): ApiAction => {
    return {
        type: "API",
        endpoint: organisationsApi,
        dispatchPrefix: "ORGANISATIONS_LIST",
    };
};

export const getOrganisations = (onSuccess: ApiOnSuccess<PagedItems<Organisation>>): ApiAction => {
    return {
        type: "API",
        endpoint: organisationsApi,
        onSuccess: onSuccess,
    };
};
