import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { statementsApi } from '@/config/api/commission';

import { CommissionError } from '../types';

type CommissionErrorReceiveAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_RECEIVE';
    payload: CommissionError | null;
};
type CommissionErrorFetchingAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_FETCHING';
};
type CommissionErrorFetchingErrorAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_FETCHING_ERROR';
};

type CommissionErrorUpdatedAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_EDIT_RECEIVE';
};
type CommissionErrorUpdatingAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING';
};
type CommissionErrorUpdatingErrorAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING_ERROR';
};
type CommissionErrorValidationErrorAction = {
    type: 'COMMISSIONS_ERROR_MAPPING_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type CommissionMappingErrorAction =
    | CommissionErrorReceiveAction
    | CommissionErrorFetchingAction
    | CommissionErrorFetchingErrorAction
    | CommissionErrorUpdatingAction
    | CommissionErrorUpdatingErrorAction
    | CommissionErrorValidationErrorAction
    | CommissionErrorUpdatedAction;

export const fetchNextMappingError = (statementId: string): ApiAction => ({
    type: 'API',
    endpoint: `${statementsApi}/${statementId}/errors/next?hasValidFormat=true`,
    dispatchPrefix: 'COMMISSIONS_ERROR_MAPPING'
});

export const receiveMappingError = (
    error: CommissionError | null
): CommissionErrorReceiveAction => ({
    type: 'COMMISSIONS_ERROR_MAPPING_RECEIVE',
    payload: error
});

export const resolveMappingError = (
    statementId: string,
    error: CommissionError,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${statementsApi}/${statementId}/errors/resolve/mapping`,
    method: 'POST',
    payload: error,
    onSuccess: onSuccess,
    dispatchPrefix: 'COMMISSIONS_ERROR_MAPPING_EDIT'
});
