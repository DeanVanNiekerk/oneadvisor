import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation/types";
import { adviceScopesApi } from "@/config/api/directory";
import { RootState } from "@/state";

import { adviceScopeIsModifiedSelector, adviceScopeSelector } from "../";
import { AdviceScopeEdit } from "../types";

type AdviceScopeReceiveAction = {
    type: "ADVICESCOPES_ADVICESCOPE_RECEIVE";
    payload: AdviceScopeEdit | null;
};
type AdviceScopeModifiedAction = {
    type: "ADVICESCOPES_ADVICESCOPE_MODIFIED";
    payload: AdviceScopeEdit;
};
type AdviceScopeVisibleAction = {
    type: "ADVICESCOPES_ADVICESCOPE_VISIBLE";
    payload: boolean;
};
type AdviceScopeUpdatedAction = {
    type: "ADVICESCOPES_ADVICESCOPE_EDIT_RECEIVE";
};
type AdviceScopeUpdatingAction = {
    type: "ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING";
};
type AdviceScopeUpdatingErrorAction = {
    type: "ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING_ERROR";
};
type AdviceScopeValidationErrorAction = {
    type: "ADVICESCOPES_ADVICESCOPE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type AdviceScopeAction =
    | AdviceScopeModifiedAction
    | AdviceScopeVisibleAction
    | AdviceScopeReceiveAction
    | AdviceScopeUpdatedAction
    | AdviceScopeUpdatingAction
    | AdviceScopeUpdatingErrorAction
    | AdviceScopeValidationErrorAction;

export const receiveAdviceScope = (
    adviceScope: AdviceScopeEdit | null
): AdviceScopeReceiveAction => ({
    type: "ADVICESCOPES_ADVICESCOPE_RECEIVE",
    payload: adviceScope,
});

export const modifyAdviceScope = (adviceScope: AdviceScopeEdit): AdviceScopeModifiedAction => ({
    type: "ADVICESCOPES_ADVICESCOPE_MODIFIED",
    payload: adviceScope,
});

export const adviceScopeVisible = (visible: boolean): AdviceScopeVisibleAction => ({
    type: "ADVICESCOPES_ADVICESCOPE_VISIBLE",
    payload: visible,
});

export const clearAdviceScope = (): AdviceScopeReceiveAction => receiveAdviceScope(null);

export const newAdviceScope = (): AdviceScopeReceiveAction => {
    const adviceScope: AdviceScopeEdit = {
        id: null,
        name: "",
    };

    return receiveAdviceScope(adviceScope);
};

export const saveAdviceScope = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, AdviceScopeReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { adviceScope } = adviceScopeSelector(getState());
        if (!adviceScope) return;

        const onSuccess = () => {
            dispatch(clearAdviceScope());
            if (onSaved) onSaved();
        };

        if (adviceScope.id) {
            dispatch(updateAdviceScope(adviceScope, onSuccess));
        } else {
            dispatch(insertAdviceScope(adviceScope, onSuccess));
        }
    };
};

export const confirmCancelAdviceScope = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, AdviceScopeReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = adviceScopeIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearAdviceScope());
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

export const updateAdviceScope = (
    adviceScope: AdviceScopeEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${adviceScopesApi}/${adviceScope.id}`,
    method: "POST",
    payload: adviceScope,
    onSuccess: onSuccess,
    dispatchPrefix: "ADVICESCOPES_ADVICESCOPE_EDIT",
});

export const insertAdviceScope = (
    adviceScope: AdviceScopeEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${adviceScopesApi}`,
    method: "POST",
    payload: adviceScope,
    onSuccess: onSuccess,
    dispatchPrefix: "ADVICESCOPES_ADVICESCOPE_EDIT",
});
