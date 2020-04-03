import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { commissionTypesApi } from "@/config/api/commission";

import { CommissionTypeEdit } from "../types";

type CommissionTypeReceiveAction = {
    type: "COMMISSIONTYPES_COMMISSIONTYPE_RECEIVE";
    payload: CommissionTypeEdit;
};

type CommissionTypeUpdatedAction = {
    type: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_RECEIVE";
};
type CommissionTypeUpdatingAction = {
    type: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING";
};
type CommissionTypeUpdatingErrorAction = {
    type: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING_ERROR";
};
type CommissionTypeValidationErrorAction = {
    type: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type CommissionTypeAction =
    | CommissionTypeReceiveAction
    | CommissionTypeUpdatedAction
    | CommissionTypeUpdatingAction
    | CommissionTypeUpdatingErrorAction
    | CommissionTypeValidationErrorAction;

export const receiveCommissionType = (
    commissionType: CommissionTypeEdit
): CommissionTypeReceiveAction => ({
    type: "COMMISSIONTYPES_COMMISSIONTYPE_RECEIVE",
    payload: commissionType,
});

export const updateCommissionType = (
    commissionType: CommissionTypeEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${commissionTypesApi}/${commissionType.id}`,
    method: "POST",
    payload: commissionType,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT",
});

export const insertCommissionType = (
    commissionType: CommissionTypeEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${commissionTypesApi}`,
    method: "POST",
    payload: commissionType,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONTYPES_COMMISSIONTYPE_EDIT",
});
