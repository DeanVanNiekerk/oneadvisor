import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { policyTypeCharacteristicsApi } from "@/config/api/client";
import { RootState } from "@/state";

import { policyTypeCharacteristicIsModifiedSelector, policyTypeCharacteristicSelector } from "../";
import { PolicyTypeCharacteristicEdit } from "../types";

type PolicyTypeCharacteristicReceiveAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE";
    payload: PolicyTypeCharacteristicEdit | null;
};
type PolicyTypeCharacteristicModifiedAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_MODIFIED";
    payload: PolicyTypeCharacteristicEdit;
};
type PolicyTypeCharacteristicVisibleAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_VISIBLE";
    payload: boolean;
};
type PolicyTypeCharacteristicUpdatedAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_RECEIVE";
};
type PolicyTypeCharacteristicUpdatingAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING";
};
type PolicyTypeCharacteristicUpdatingErrorAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING_ERROR";
};
type PolicyTypeCharacteristicValidationErrorAction = {
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type PolicyTypeCharacteristicAction =
    | PolicyTypeCharacteristicModifiedAction
    | PolicyTypeCharacteristicVisibleAction
    | PolicyTypeCharacteristicReceiveAction
    | PolicyTypeCharacteristicUpdatedAction
    | PolicyTypeCharacteristicUpdatingAction
    | PolicyTypeCharacteristicUpdatingErrorAction
    | PolicyTypeCharacteristicValidationErrorAction;

export const receivePolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit | null
): PolicyTypeCharacteristicReceiveAction => ({
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE",
    payload: policyTypeCharacteristic,
});

export const modifyPolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit
): PolicyTypeCharacteristicModifiedAction => ({
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_MODIFIED",
    payload: policyTypeCharacteristic,
});

export const policyTypeCharacteristicVisible = (
    visible: boolean
): PolicyTypeCharacteristicVisibleAction => ({
    type: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_VISIBLE",
    payload: visible,
});

export const clearPolicyTypeCharacteristic = (): PolicyTypeCharacteristicReceiveAction =>
    receivePolicyTypeCharacteristic(null);

export const newPolicyTypeCharacteristic = (): PolicyTypeCharacteristicReceiveAction => {
    const policyTypeCharacteristic: PolicyTypeCharacteristicEdit = {
        id: null,
        name: "",
        displayOrder: 0,
        policyTypeId: null,
    };

    return receivePolicyTypeCharacteristic(policyTypeCharacteristic);
};

export const savePolicyTypeCharacteristic = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, PolicyTypeCharacteristicReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { policyTypeCharacteristic } = policyTypeCharacteristicSelector(getState());
        if (!policyTypeCharacteristic) return;

        const onSuccess = () => {
            dispatch(clearPolicyTypeCharacteristic());
            if (onSaved) onSaved();
        };

        if (policyTypeCharacteristic.id) {
            dispatch(updatePolicyTypeCharacteristic(policyTypeCharacteristic, onSuccess));
        } else {
            dispatch(insertPolicyTypeCharacteristic(policyTypeCharacteristic, onSuccess));
        }
    };
};

export const confirmCancelPolicyTypeCharacteristic = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, PolicyTypeCharacteristicReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = policyTypeCharacteristicIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearPolicyTypeCharacteristic());
            onCancelled();
        };

        if (modifed)
            return showConfirm({
                onOk: () => {
                    cancel();
                },
            });

        cancel();
    };
};

export const updatePolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyTypeCharacteristicsApi}/${policyTypeCharacteristic.id}`,
    method: "POST",
    payload: policyTypeCharacteristic,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT",
});

export const insertPolicyTypeCharacteristic = (
    policyTypeCharacteristic: PolicyTypeCharacteristicEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${policyTypeCharacteristicsApi}`,
    method: "POST",
    payload: policyTypeCharacteristic,
    onSuccess: onSuccess,
    dispatchPrefix: "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT",
});
