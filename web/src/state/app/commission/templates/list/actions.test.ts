import { statementTemplatesApi } from '@/config/api/commission';

import * as actions from './actions';

describe('commission: templates: list actions', () => {
    it('should dispatch API when fetchCommissionStatementTemplates is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: statementTemplatesApi,
            dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST'
        };

        expect(actions.fetchCommissionStatementTemplates()).toEqual(
            expectedAction
        );
    });
});
