import { appendFiltersQuery } from '@/app/query';
import { ApiAction } from '@/app/types';
import { statementsApi } from '@/config/api/commission';

import { PagedStatements, Statement } from '../types';

type StatementPreviewReceiveAction = {
    type: 'STATEMENTS_STATEMENT_PREVIEW_RECEIVE';
    payload: PagedStatements;
};
type StatementPreviewFetchingAction = {
    type: 'STATEMENTS_STATEMENT_PREVIEW_FETCHING';
};
type StatementPreviewFetchingErrorAction = {
    type: 'STATEMENTS_STATEMENT_PREVIEW_FETCHING_ERROR';
};
type StatementPreviewClearAction = {
    type: 'STATEMENTS_STATEMENT_PREVIEW_CLEAR';
};

export type StatementPreviewAction =
    | StatementPreviewReceiveAction
    | StatementPreviewFetchingAction
    | StatementPreviewFetchingErrorAction
    | StatementPreviewClearAction;

export const fetchStatementPreview = (statementId: string): ApiAction => {
    let api = statementsApi;
    api = appendFiltersQuery(api, {
        commissionStatementId: [statementId]
    });
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'STATEMENTS_STATEMENT_PREVIEW'
    };
};

export const clearStatementPreview = (): StatementPreviewClearAction => ({
    type: 'STATEMENTS_STATEMENT_PREVIEW_CLEAR'
});
