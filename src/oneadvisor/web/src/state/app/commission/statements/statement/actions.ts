import moment from "moment";
import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnFailure, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { commissionsImportApi, statementsApi } from "@/config/api/commission";
import { companiesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";

import { statementIsModifiedSelector, statementSelector, statementsSelector } from "../";
import { StatementEdit } from "../types";

type StatementReceiveAction = {
    type: "STATEMENTS_STATEMENT_RECEIVE";
    payload: StatementEdit | null;
};
type StatementModifiedAction = {
    type: "STATEMENTS_STATEMENT_MODIFIED";
    payload: StatementEdit | null;
};
type StatementVisibleAction = {
    type: "STATEMENTS_STATEMENT_VISIBLE";
    payload: boolean;
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
    | StatementModifiedAction
    | StatementVisibleAction
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

export const modifyStatement = (statement: StatementEdit): StatementModifiedAction => ({
    type: "STATEMENTS_STATEMENT_MODIFIED",
    payload: statement,
});

export const statementVisible = (visible: boolean): StatementVisibleAction => ({
    type: "STATEMENTS_STATEMENT_VISIBLE",
    payload: visible,
});

export const clearStatement = (): StatementReceiveAction => receiveStatement(null);

export const newStatement = (): ThunkAction<void, RootState, {}, StatementReceiveAction> => {
    return (dispatch, getState) => {
        const { filterYear, filterMonth } = statementsSelector(getState());
        const companies = companiesSelector(getState()).items;

        const today = moment();
        let date = moment()
            .year(filterYear)
            .month(filterMonth - 1);
        if (today.year() !== date.year() || today.month() !== date.month()) date = date.date(1);

        const statement: StatementEdit = {
            id: null,
            amountIncludingVAT: 0,
            vat: 0,
            companyId: companies[0].id,
            processed: false,
            date: date.format(),
        };

        dispatch(receiveStatement(statement));
    };
};

export const saveStatement = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, StatementReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { statement } = statementSelector(getState());
        if (!statement) return;

        const onSuccess = () => {
            dispatch(clearStatement());
            if (onSaved) onSaved();
        };

        if (statement.id) {
            dispatch(updateStatement(statement, onSuccess));
        } else {
            dispatch(insertStatement(statement, onSuccess));
        }
    };
};

export const confirmCancelStatement = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, StatementReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = statementIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearStatement());
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

export const updateStatement = (statement: StatementEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statement.id}`,
    method: "POST",
    payload: statement,
    onSuccess: onSuccess,
    dispatchPrefix: "STATEMENTS_STATEMENT_EDIT",
});

export const insertStatement = (statement: StatementEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}`,
    method: "POST",
    payload: statement,
    onSuccess: onSuccess,
    dispatchPrefix: "STATEMENTS_STATEMENT_EDIT",
});

export const deleteCommissions = (
    commissionStatementId: string,
    onSuccess?: ApiOnSuccess,
    onFailure?: ApiOnFailure
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
