import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, Result, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { statementsApi } from "@/config/api/commission";
import { RootState } from "@/state/rootReducer";

import { mappingErrorIsModifiedSelector, mappingErrorSelector } from "../";
import { CommissionErrorEdit } from "../types";

type CommissionErrorReceiveAction = {
    type: "COMMISSIONS_ERROR_MAPPING_RECEIVE";
    payload: CommissionErrorEdit | null;
};
type CommissionErrorModifiedAction = {
    type: "COMMISSIONS_ERROR_MAPPING_MODIFIED";
    payload: CommissionErrorEdit | null;
};
type CommissionErrorVisibleAction = {
    type: "COMMISSIONS_ERROR_MAPPING_VISIBLE";
    payload: boolean;
};
type CommissionErrorFetchingAction = {
    type: "COMMISSIONS_ERROR_MAPPING_FETCHING";
};
type CommissionErrorFetchingErrorAction = {
    type: "COMMISSIONS_ERROR_MAPPING_FETCHING_ERROR";
};
type CommissionErrorUpdatedAction = {
    type: "COMMISSIONS_ERROR_MAPPING_EDIT_RECEIVE";
};
type CommissionErrorUpdatingAction = {
    type: "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING";
};
type CommissionErrorUpdatingErrorAction = {
    type: "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING_ERROR";
};
type CommissionErrorValidationErrorAction = {
    type: "COMMISSIONS_ERROR_MAPPING_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type CommissionMappingErrorAction =
    | CommissionErrorModifiedAction
    | CommissionErrorVisibleAction
    | CommissionErrorReceiveAction
    | CommissionErrorFetchingAction
    | CommissionErrorFetchingErrorAction
    | CommissionErrorUpdatingAction
    | CommissionErrorUpdatingErrorAction
    | CommissionErrorValidationErrorAction
    | CommissionErrorUpdatedAction;

export const fetchMappingError = (statementId: string, commissionErrorId: string): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statementId}/errors/${commissionErrorId}`,
    dispatchPrefix: "COMMISSIONS_ERROR_MAPPING",
});

export const fetchNextMappingError = (statementId: string): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statementId}/errors/next`,
    dispatchPrefix: "COMMISSIONS_ERROR_MAPPING",
});

export const receiveMappingError = (error: CommissionErrorEdit | null): CommissionErrorReceiveAction => ({
    type: "COMMISSIONS_ERROR_MAPPING_RECEIVE",
    payload: error,
});

export const modifyMappingError = (error: CommissionErrorEdit): CommissionErrorModifiedAction => ({
    type: 'COMMISSIONS_ERROR_MAPPING_MODIFIED',
    payload: error
});

export const mappingErrorVisible = (visible: boolean): CommissionErrorVisibleAction => ({
    type: "COMMISSIONS_ERROR_MAPPING_VISIBLE",
    payload: visible,
});

export const clearMappingError = (): CommissionErrorReceiveAction => receiveMappingError(null);

export const saveMappingError = (statementId: string, onSaved?: () => void): ThunkAction<void, RootState, {}, CommissionErrorReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { commissionError } = mappingErrorSelector(getState());
        if (!commissionError) return;

        const onSuccess = () => {
            dispatch(clearMappingError());
            if (onSaved) onSaved();
        }

        dispatch(resolveMappingError(statementId, commissionError, onSuccess));
    };
}

export const confirmCancelMappingError = (showConfirm: ShowConfirm, onCancelled: () => void): ThunkAction<void, RootState, {}, CommissionErrorReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = mappingErrorIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearMappingError());
            onCancelled();
        }

        if (modifed)
            return showConfirm({ onOk: () => { cancel(); } });

        cancel();
    };
}

export const resolveMappingError = (
    statementId: string,
    error: CommissionErrorEdit,
    onSuccess: ApiOnSuccess<Result<CommissionErrorEdit>>
): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statementId}/errors/resolve/mapping`,
    method: "POST",
    payload: error,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONS_ERROR_MAPPING_EDIT",
});

export const deleteMappingError = (
    statementId: string,
    commissionErrorId: string,
    onSuccess: ApiOnSuccess<Result>
): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statementId}/errors/${commissionErrorId}`,
    method: "DELETE",
    onSuccess: onSuccess,
});
