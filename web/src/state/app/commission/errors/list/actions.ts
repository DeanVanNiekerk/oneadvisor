import { ApiAction, ApiOnSuccess } from '@/app/types';
import { statementsApi } from '@/config/api/commission';

import { CommissionError } from '../types';

export const getCommissionErrors = (
    statementId: string,
    hasValidFormat: boolean,
    onSuccess: (errors: CommissionError[]) => void
): ApiAction => ({
    type: 'API',
    endpoint: `${statementsApi}/${statementId}/errors?hasValidFormat=${hasValidFormat}`,
    onSuccess: onSuccess
});
