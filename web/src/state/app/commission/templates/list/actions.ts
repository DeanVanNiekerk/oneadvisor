import { PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { statementTemplatesApi } from '@/config/api/commission';

import { CommissionStatementTemplate } from '../types';

type TemplateListReceiveAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_RECEIVE';
    payload: PagedItems<CommissionStatementTemplate>;
};
type TemplateListFetchingAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING';
};
type TemplateListFetchingErrorAction = {
    type: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING_ERROR';
};

export type TemplateListAction =
    | TemplateListReceiveAction
    | TemplateListFetchingAction
    | TemplateListFetchingErrorAction;

export const fetchCommissionStatementTemplates = (): ApiAction => {
    return {
        type: 'API',
        endpoint: statementTemplatesApi,
        dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST'
    };
};
