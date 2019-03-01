import { ApiAction, ApiOnFailure, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { statementTemplatesApi } from '@/config/api/commission';

import { CommissionStatementTemplateEdit } from '../types';

type TemplateReceiveAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE';
    payload: CommissionStatementTemplateEdit | null;
};
type TemplateFetchingAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_FETCHING';
};
type TemplateFetchingErrorAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_FETCHING_ERROR';
};

type TemplateUpdatedAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_RECEIVE';
};
type TemplateUpdatingAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING';
};
type TemplateUpdatingErrorAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING_ERROR';
};
type TemplateValidationErrorAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type TemplateAction =
    | TemplateReceiveAction
    | TemplateFetchingAction
    | TemplateFetchingErrorAction
    | TemplateUpdatedAction
    | TemplateUpdatingAction
    | TemplateUpdatingErrorAction
    | TemplateValidationErrorAction;

export const receiveCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit | null
): TemplateAction => ({
    type: 'COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE',
    payload: template
});

export const fetchCommissionStatementTemplate = (
    templateId: string
): ApiAction => ({
    type: 'API',
    endpoint: `${statementTemplatesApi}/${templateId}`,
    dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATE'
});

export const updateCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit,
    onSuccess?: ApiOnSuccess,
    onFailure?: ApiOnFailure
): ApiAction => ({
    type: 'API',
    endpoint: `${statementTemplatesApi}/${template.id}`,
    method: 'POST',
    payload: template,
    onSuccess: onSuccess,
    onFailure: onFailure,
    dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT'
});

export const insertCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit,
    onSuccess?: ApiOnSuccess,
    onFailure?: ApiOnFailure
): ApiAction => ({
    type: 'API',
    endpoint: `${statementTemplatesApi}`,
    method: 'POST',
    payload: template,
    onSuccess: onSuccess,
    onFailure: onFailure,
    dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT'
});
