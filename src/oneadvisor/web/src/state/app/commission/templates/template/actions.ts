import { ValidationResult } from "@/app/validation";

import { CommissionStatementTemplateEdit } from "../types";

export type TemplateReceiveAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE";
    payload: CommissionStatementTemplateEdit | null;
};
export type TemplateModifiedAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_MODIFIED";
    payload: CommissionStatementTemplateEdit | null;
};
export type TemplateFetchingAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_FETCHING";
};
export type TemplateFetchingErrorAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_FETCHING_ERROR";
};
export type TemplateVisibleAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_VISIBLE";
    payload: boolean;
};
export type TemplateUpdatedAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_RECEIVE";
};
export type TemplateUpdatingAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING";
};
export type TemplateUpdatingErrorAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING_ERROR";
};
export type TemplateValidationErrorAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};
export type TemplateSheetIndexReceiveAction = {
    type: "COMMISSIONS_STATEMENT_TEMPLATE_SHEET_INDEX_RECEIVE";
    payload: number;
};

export type TemplateAction =
    | TemplateModifiedAction
    | TemplateSheetIndexReceiveAction
    | TemplateReceiveAction
    | TemplateVisibleAction
    | TemplateFetchingAction
    | TemplateFetchingErrorAction
    | TemplateUpdatedAction
    | TemplateUpdatingAction
    | TemplateUpdatingErrorAction
    | TemplateValidationErrorAction;

export const receiveCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit | null
): TemplateReceiveAction => ({
    type: "COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE",
    payload: template,
});

export const modifyCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit
): TemplateModifiedAction => ({
    type: "COMMISSIONS_STATEMENT_TEMPLATE_MODIFIED",
    payload: template,
});

export const commissionStatementTemplateVisible = (visible: boolean): TemplateVisibleAction => ({
    type: "COMMISSIONS_STATEMENT_TEMPLATE_VISIBLE",
    payload: visible,
});

export const receiveCommissionStatementTemplateSheetIndex = (
    index: number
): TemplateSheetIndexReceiveAction => ({
    type: "COMMISSIONS_STATEMENT_TEMPLATE_SHEET_INDEX_RECEIVE",
    payload: index,
});
