import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { statementsApi } from '@/config/api/commission';

import { CommissionError } from '../types';

type CommissionErrorReceiveAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_RECEIVE';
    payload: CommissionError | null;
};
type CommissionErrorFetchingAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_FETCHING';
};
type CommissionErrorFetchingErrorAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_FETCHING_ERROR';
};

type CommissionErrorUpdatedAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_EDIT_RECEIVE';
};
type CommissionErrorUpdatingAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING';
};
type CommissionErrorUpdatingErrorAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING_ERROR';
};
type CommissionErrorValidationErrorAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type CommissionErrorAction =
    | CommissionErrorReceiveAction
    | CommissionErrorFetchingAction
    | CommissionErrorFetchingErrorAction
    | CommissionErrorUpdatingAction
    | CommissionErrorUpdatingErrorAction
    | CommissionErrorValidationErrorAction
    | CommissionErrorUpdatedAction;

export const fetchNextFormatError = (statementId: string): ApiAction => ({
    type: 'API',
    endpoint: `${statementsApi}/${statementId}/errors/next?hasValidFormat=false`,
    dispatchPrefix: 'COMMISSIONS_ERROR_FORMAT'
});

export const receiveFormatError = (
    error: CommissionError | null
): CommissionErrorReceiveAction => ({
    type: 'COMMISSIONS_ERROR_FORMAT_RECEIVE',
    payload: error
});

export const resolveFormatError = (
    statementId: string,
    error: CommissionError,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${statementsApi}/${statementId}/errors/resolve/format`,
    method: 'POST',
    payload: error,
    onSuccess: onSuccess,
    dispatchPrefix: 'COMMISSIONS_ERROR_FORMAT_EDIT'
});
