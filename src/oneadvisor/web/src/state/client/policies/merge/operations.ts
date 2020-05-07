import { ThunkAction } from "redux-thunk";

import { ApiAction } from "@/app/types";
import { RootState } from "@/state";

import { policiesSelectedIdsSelector, policySelector } from "../";
import { MergePolicies } from "../types";
import { mergePolicies } from "./actions";

export const saveMergePolicies = (
    onSuccess: () => void
): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        const { policy } = policySelector(getState());
        const sourcePolicyIds = policiesSelectedIdsSelector(getState());

        if (!policy) return;

        const merge: MergePolicies = {
            targetPolicy: policy,
            sourcePolicyIds: sourcePolicyIds,
        };

        dispatch(
            mergePolicies(merge, () => {
                onSuccess();
            })
        );
    };
};
