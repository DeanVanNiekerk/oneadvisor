import { ApiAction } from "@/app/types";
import { branchesApi } from "@/config/api/directory";

import { BranchSimple } from "../types";

type BranchSimpleListReceiveAction = {
    type: "BRANCHESSIMPLE_LIST_RECEIVE";
    payload: BranchSimple[];
};
type BranchSimpleListFetchingAction = { type: "BRANCHESSIMPLE_LIST_FETCHING" };
type BranchSimpleListFetchingErrorAction = {
    type: "BRANCHESSIMPLE_LIST_FETCHING_ERROR";
};

export type BranchSimpleListAction =
    | BranchSimpleListReceiveAction
    | BranchSimpleListFetchingAction
    | BranchSimpleListFetchingErrorAction;

export const fetchBranchesSimple = (): ApiAction => ({
    type: "API",
    endpoint: `${branchesApi}/simple`,
    dispatchPrefix: "BRANCHESSIMPLE_LIST",
});
