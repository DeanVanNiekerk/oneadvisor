import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { commissionsApi } from "@/config/api/commission";

import { CommissionEdit } from "../types";

type CommissionReceiveAction = {
    type: "COMMISSIONS_COMMISSION_RECEIVE";
    payload: CommissionEdit | null;
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

export const fetchCommission = (commissionId: string): ApiAction => ({
    type: "API",
    endpoint: `${commissionsApi}/${commissionId}`,
    dispatchPrefix: "COMMISSIONS_COMMISSION",
});

export const updateCommission = (commission: CommissionEdit, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${commissionsApi}/${commission.id}`,
    method: "POST",
    payload: commission,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONS_COMMISSION_EDIT",
});

export const insertCommission = (commission: CommissionEdit, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${commissionsApi}`,
    method: "POST",
    payload: commission,
    onSuccess: onSuccess,
    dispatchPrefix: "COMMISSIONS_COMMISSION_EDIT",
});
