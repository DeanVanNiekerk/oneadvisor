import { PagedItems } from "@/app/table";
import { ApiAction } from "@/app/types";
import { policyProductTypesApi } from "@/config/api/client";

import { PolicyProductType } from "../types";

type PolicyProductTypeListReceiveAction = {
    type: "POLICYPRODUCTTYPES_LIST_RECEIVE";
    payload: PolicyProductType[];
};
type PolicyProductTypeListFetchingAction = {
    type: "POLICYPRODUCTTYPES_LIST_FETCHING";
};
type PolicyProductTypeListFetchingErrorAction = {
    type: "POLICYPRODUCTTYPES_LIST_FETCHING_ERROR";
};

export type PolicyProductTypeListAction =
    | PolicyProductTypeListReceiveAction
    | PolicyProductTypeListFetchingAction
    | PolicyProductTypeListFetchingErrorAction;

export const receivePolicyProductTypes = (payload: PolicyProductType[]): PolicyProductTypeListAction => ({
    type: "POLICYPRODUCTTYPES_LIST_RECEIVE",
    payload,
});

export const fetchPolicyProductTypes = (): ApiAction => {
    return {
        type: "API",
        endpoint: policyProductTypesApi,
        dispatchPrefix: "POLICYPRODUCTTYPES_LIST",
    };
};
