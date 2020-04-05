import { ApiAction } from "@/app/types";
import { adviceScopesApi } from "@/config/api/directory";

import { AdviceScope } from "../types";

type AdviceScopeListReceiveAction = {
    type: "ADVICESCOPES_LIST_RECEIVE";
    payload: AdviceScope[];
};
type AdviceScopeListFetchingAction = { type: "ADVICESCOPES_LIST_FETCHING" };
type AdviceScopeListFetchingErrorAction = {
    type: "ADVICESCOPES_LIST_FETCHING_ERROR";
};

export type AdviceScopeListAction =
    | AdviceScopeListReceiveAction
    | AdviceScopeListFetchingAction
    | AdviceScopeListFetchingErrorAction;

export const receiveAdviceScopes = (payload: AdviceScope[]): AdviceScopeListAction => ({
    type: "ADVICESCOPES_LIST_RECEIVE",
    payload,
});

export const fetchAdviceScopes = (): ApiAction => {
    return {
        type: "API",
        endpoint: adviceScopesApi,
        dispatchPrefix: "ADVICESCOPES_LIST",
    };
};
