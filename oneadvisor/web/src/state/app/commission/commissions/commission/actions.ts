import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { commissionsApi } from "@/config/api/commission";
import { RootState } from "@/state/rootReducer";

import { commissionIsModifiedSelector, commissionSelector } from "../";
import { CommissionEdit } from "../types";

type CommissionReceiveAction = {
    type: "COMMISSIONS_COMMISSION_RECEIVE";
    payload: CommissionEdit | null;
};
type CommissionModifiedAction = {
    type: "COMMISSIONS_COMMISSION_MODIFIED";
    payload: CommissionEdit | null;
};
type CommissionVisibleAction = {
    type: "COMMISSIONS_COMMISSION_VISIBLE";
    payload: boolean;
};
type CommissionFetchingAction = { type: "COMMISSIONS_COMMISSION_FETCHING" };
type CommissionFetchingErrorAction = {
    type: "COMMISSIONS_COMMISSION_FETCHING_ERROR";
};
type CommissionUpdatedAction = { type: "COMMISSIONS_COMMISSION_EDIT_RECEIVE" };
type CommissionUpdatingAction = {
    type: "COMMISSIONS_COMMISSION_EDIT_FETCHING";
};
type CommissionUpdatingErrorAction = {
    type: "COMMISSIONS_COMMISSION_EDIT_FETCHING_ERROR";
};
type CommissionValidationErrorAction = {
    type: "COMMISSIONS_COMMISSION_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type CommissionAction =
    | CommissionModifiedAction
    | CommissionVisibleAction
    | CommissionReceiveAction
    | CommissionFetchingAction
    | CommissionFetchingErrorAction
    | CommissionUpdatedAction
    | CommissionUpdatingAction
    | CommissionUpdatingErrorAction
    | CommissionValidationErrorAction;

export const receiveCommission = (commission: CommissionEdit | null): CommissionReceiveAction => ({
    type: "COMMISSIONS_COMMISSION_RECEIVE",
    payload: commission,
});

export const modifyCommission = (commission: CommissionEdit): CommissionModifiedAction => ({
    type: "COMMISSIONS_COMMISSION_MODIFIED",
    payload: commission,
});

export const commissionVisible = (visible: boolean): CommissionVisibleAction => ({
    type: "COMMISSIONS_COMMISSION_VISIBLE",
    payload: visible,
});

export const clearCommission = (): CommissionReceiveAction => receiveCommission(null);

export const fetchCommission = (commissionId: string): ApiAction => ({
    type: "API",
    endpoint: `${commissionsApi}/${commissionId}`,
    dispatchPrefix: "COMMISSIONS_COMMISSION",
});

export const saveCommission = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, CommissionReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { commission } = commissionSelector(getState());
        if (!commission) return;

        const onSuccess = () => {
            dispatch(clearCommission());
            if (onSaved) onSaved();
        };

        if (commission.id) {
            dispatch(updateCommission(commission, onSuccess));
        } else {
            dispatch(insertCommission(commission, onSuccess));
        }
    };
};

export const confirmCancelCommission = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, CommissionReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = commissionIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearCommission());
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

export const updateCommission = (
    commission: CommissionEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${commissionsApi}/${commission.id}`,
    method: "POST",
    payload: commission,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONS_COMMISSION_EDIT",
});

export const insertCommission = (
    commission: CommissionEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${commissionsApi}`,
    method: "POST",
    payload: commission,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONS_COMMISSION_EDIT",
});
