import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { statementsApi } from '@/config/api/commission';

import { CommissionError } from '../types';

type CommissionErrorReceiveAction = {
    type: 'COMMISSIONS_ERROR_FORMAT_RECEIVE';
    payload: CommissionError | null;
};

export type StatementAction = CommissionErrorReceiveAction;

export const fetchNextFormatError = (statementId: string): ApiAction => ({
    type: 'API',
    endpoint: `${statementsApi}/${statementId}/errors/next?hasValidFormat=false`,
    dispatchPrefix: 'COMMISSIONS_ERROR_FORMAT'
});

// export const updateStatement = (
//     statement: StatementEdit,
//     onSuccess: ApiOnSuccess
// ): ApiAction => ({
//     type: 'API',
//     endpoint: `${statementsApi}/${statement.id}`,
//     method: 'POST',
//     payload: statement,
//     onSuccess: onSuccess,
//     dispatchPrefix: 'STATEMENTS_STATEMENT_EDIT'
// });
