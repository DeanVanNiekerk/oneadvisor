import { ApiAction, ApiOnFailure, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { commissionsImportApi, statementsApi } from "@/config/api/commission";

import { StatementEdit } from "../types";

type StatementReceiveAction = {
    type: "STATEMENTS_STATEMENT_RECEIVE";
    payload: StatementEdit | null;
};
type StatementFetchingAction = { type: "STATEMENTS_STATEMENT_FETCHING" };
type StatementFetchingErrorAction = {
    type: "STATEMENTS_STATEMENT_FETCHING_ERROR";
};

type StatementUpdatedAction = { type: "STATEMENTS_STATEMENT_EDIT_RECEIVE" };
type StatementUpdatingAction = {
    type: "STATEMENTS_STATEMENT_EDIT_FETCHING";
};
type StatementUpdatingErrorAction = {
    type: "STATEMENTS_STATEMENT_EDIT_FETCHING_ERROR";
};
type StatementValidationErrorAction = {
    type: "STATEMENTS_STATEMENT_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type StatementAction =
    | StatementReceiveAction
    | StatementFetchingAction
    | StatementFetchingErrorAction
    | StatementUpdatedAction
    | StatementUpdatingAction
    | StatementUpdatingErrorAction
    | StatementValidationErrorAction;

export const receiveStatement = (statement: StatementEdit | null): StatementReceiveAction => ({
    type: "STATEMENTS_STATEMENT_RECEIVE",
    payload: statement,
});

export const fetchStatement = (statementId: string): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statementId}`,
    dispatchPrefix: "STATEMENTS_STATEMENT",
});

export const updateStatement = (statement: StatementEdit, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statement.id}`,
    method: "POST",
    payload: statement,
    onSuccess: onSuccess,
    dispatchPrefix: "STATEMENTS_STATEMENT_EDIT",
});

export const insertStatement = (statement: StatementEdit, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}`,
    method: "POST",
    payload: statement,
    onSuccess: onSuccess,
    dispatchPrefix: "STATEMENTS_STATEMENT_EDIT",
});

export const deleteCommissions = (
    commissionStatementId: string,
    onSuccess: ApiOnSuccess,
    onFailure: ApiOnFailure
): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${commissionStatementId}/commissions`,
    method: "DELETE",
    onSuccess: onSuccess,
    onFailure: onFailure,
});

export const reimportCommissions = (
    commissionStatementId: string,
    commissionStatementTemplateId: string,
    onSuccess: ApiOnSuccess,
    onFailure: ApiOnFailure
): ApiAction => ({
    type: "API",
    endpoint: `${commissionsImportApi}/${commissionStatementId}/reimport?commissionStatementTemplateId=${commissionStatementTemplateId}`,
    method: "POST",
    onSuccess: onSuccess,
    onFailure: onFailure,
});

export const bulkReimportCommissions = (
    startDate: string,
    endDate: string,
    onSuccess: ApiOnSuccess,
    onFailure: ApiOnFailure
): ApiAction => ({
    type: "API",
    endpoint: `${commissionsImportApi}/reimport?startDate=${startDate}&endDate=${endDate}`,
    method: "POST",
    onSuccess: onSuccess,
    onFailure: onFailure,
});
