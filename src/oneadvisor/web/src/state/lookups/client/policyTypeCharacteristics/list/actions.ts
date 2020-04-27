import { ApiAction } from "@/app/types";
import { policyTypeCharacteristicsApi } from "@/config/api/client";

import { PolicyTypeCharacteristic } from "../types";

type PolicyTypeCharacteristicListReceiveAction = {
    type: "POLICYTYPECHARACTERISTICS_LIST_RECEIVE";
    payload: PolicyTypeCharacteristic[];
};
type PolicyTypeCharacteristicListFetchingAction = {
    type: "POLICYTYPECHARACTERISTICS_LIST_FETCHING";
};
type PolicyTypeCharacteristicListFetchingErrorAction = {
    type: "POLICYTYPECHARACTERISTICS_LIST_FETCHING_ERROR";
};

export type PolicyTypeCharacteristicListAction =
    | PolicyTypeCharacteristicListReceiveAction
    | PolicyTypeCharacteristicListFetchingAction
    | PolicyTypeCharacteristicListFetchingErrorAction;

export const receivePolicyTypeCharacteristics = (
    payload: PolicyTypeCharacteristic[]
): PolicyTypeCharacteristicListAction => ({
    type: "POLICYTYPECHARACTERISTICS_LIST_RECEIVE",
    payload,
});

export const fetchPolicyTypeCharacteristics = (): ApiAction => {
    return {
        type: "API",
        endpoint: policyTypeCharacteristicsApi,
        dispatchPrefix: "POLICYTYPECHARACTERISTICS_LIST",
    };
};
