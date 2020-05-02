import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation/types";
import { adviceServicesApi } from "@/config/api/directory";
import { RootState } from "@/state";

import { adviceServiceIsModifiedSelector, adviceServiceSelector } from "../";
import { AdviceServiceEdit } from "../types";

type AdviceServiceReceiveAction = {
    type: "ADVICESERVICES_ADVICESERVICE_RECEIVE";
    payload: AdviceServiceEdit | null;
};
type AdviceServiceModifiedAction = {
    type: "ADVICESERVICES_ADVICESERVICE_MODIFIED";
    payload: AdviceServiceEdit;
};
type AdviceServiceVisibleAction = {
    type: "ADVICESERVICES_ADVICESERVICE_VISIBLE";
    payload: boolean;
};
type AdviceServiceUpdatedAction = {
    type: "ADVICESERVICES_ADVICESERVICE_EDIT_RECEIVE";
};
type AdviceServiceUpdatingAction = {
    type: "ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING";
};
type AdviceServiceUpdatingErrorAction = {
    type: "ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING_ERROR";
};
type AdviceServiceValidationErrorAction = {
    type: "ADVICESERVICES_ADVICESERVICE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type AdviceServiceAction =
    | AdviceServiceModifiedAction
    | AdviceServiceVisibleAction
    | AdviceServiceReceiveAction
    | AdviceServiceUpdatedAction
    | AdviceServiceUpdatingAction
    | AdviceServiceUpdatingErrorAction
    | AdviceServiceValidationErrorAction;

export const receiveAdviceService = (
    adviceService: AdviceServiceEdit | null
): AdviceServiceReceiveAction => ({
    type: "ADVICESERVICES_ADVICESERVICE_RECEIVE",
    payload: adviceService,
});

export const modifyAdviceService = (
    adviceService: AdviceServiceEdit
): AdviceServiceModifiedAction => ({
    type: "ADVICESERVICES_ADVICESERVICE_MODIFIED",
    payload: adviceService,
});

export const adviceServiceVisible = (visible: boolean): AdviceServiceVisibleAction => ({
    type: "ADVICESERVICES_ADVICESERVICE_VISIBLE",
    payload: visible,
});

export const clearAdviceService = (): AdviceServiceReceiveAction => receiveAdviceService(null);

export const newAdviceService = (): AdviceServiceReceiveAction => {
    const adviceService: AdviceServiceEdit = {
        id: null,
        name: "",
        displayOrder: 0,
    };

    return receiveAdviceService(adviceService);
};

export const saveAdviceService = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, AdviceServiceReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { adviceService } = adviceServiceSelector(getState());
        if (!adviceService) return;

        const onSuccess = () => {
            dispatch(clearAdviceService());
            if (onSaved) onSaved();
        };

        if (adviceService.id) {
            dispatch(updateAdviceService(adviceService, onSuccess));
        } else {
            dispatch(insertAdviceService(adviceService, onSuccess));
        }
    };
};

export const confirmCancelAdviceService = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, AdviceServiceReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = adviceServiceIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearAdviceService());
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

export const updateAdviceService = (
    adviceService: AdviceServiceEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${adviceServicesApi}/${adviceService.id}`,
    method: "POST",
    payload: adviceService,
    onSuccess: onSuccess,
    dispatchPrefix: "ADVICESERVICES_ADVICESERVICE_EDIT",
});

export const insertAdviceService = (
    adviceService: AdviceServiceEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${adviceServicesApi}`,
    method: "POST",
    payload: adviceService,
    onSuccess: onSuccess,
    dispatchPrefix: "ADVICESERVICES_ADVICESERVICE_EDIT",
});
