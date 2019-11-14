import { appendFiltersQuery } from "@/app/query";
import { PagedItems } from "@/app/table";
import { ApiAction } from "@/app/types";
import { branchesApi } from "@/config/api/directory";

import { Branch, BranchFilters } from "../types";

type BranchListReceiveAction = {
    type: "BRANCHES_LIST_RECEIVE";
    payload: PagedItems<Branch>;
};
type BranchListFetchingAction = { type: "BRANCHES_LIST_FETCHING" };
type BranchListFetchingErrorAction = {
    type: "BRANCHES_LIST_FETCHING_ERROR";
};

export type BranchListAction =
    | BranchListReceiveAction
    | BranchListFetchingAction
    | BranchListFetchingErrorAction;

export const fetchBranches = (filters: BranchFilters): ApiAction => {
    let api = branchesApi;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "BRANCHES_LIST",
    };
};
