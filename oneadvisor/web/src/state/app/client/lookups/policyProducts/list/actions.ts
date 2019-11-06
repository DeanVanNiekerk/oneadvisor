import { ApiAction } from "@/app/types";
import { policyProductsApi } from "@/config/api/client";

import { PolicyProduct } from "../types";

type PolicyProductListReceiveAction = {
    type: "POLICYPRODUCTS_LIST_RECEIVE";
    payload: PolicyProduct[];
};
type PolicyProductListFetchingAction = {
    type: "POLICYPRODUCTS_LIST_FETCHING";
};
type PolicyProductListFetchingErrorAction = {
    type: "POLICYPRODUCTS_LIST_FETCHING_ERROR";
};

export type PolicyProductListAction =
    | PolicyProductListReceiveAction
    | PolicyProductListFetchingAction
    | PolicyProductListFetchingErrorAction;

export const receivePolicyProducts = (payload: PolicyProduct[]): PolicyProductListAction => ({
    type: "POLICYPRODUCTS_LIST_RECEIVE",
    payload,
});

export const fetchPolicyProducts = (): ApiAction => {
    return {
        type: "API",
        endpoint: policyProductsApi,
        dispatchPrefix: "POLICYPRODUCTS_LIST",
    };
};
