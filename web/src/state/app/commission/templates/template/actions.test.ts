import { statementTemplatesApi } from '@/config/api/commission';

import { CommissionStatementTemplateEdit } from '../';
import * as actions from './actions';

describe('commission statement template actions', () => {
    it('should dispatch API when fetchCommissionStatementTemplate is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${statementTemplatesApi}/99`,
            dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATE'
        };

        expect(actions.fetchCommissionStatementTemplate('99')).toEqual(
            expectedAction
        );
    });

    it('should dispatch API when updateCommissionStatementTemplate is called', () => {
        const template: CommissionStatementTemplateEdit = {
            id: '10',
            companyId: '99',
            name: '321',
            config: {
                dataStart: {
                    headerColumn: 'A',
                    headerValue: 'Broker'
                },
                fields: []
            }
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${statementTemplatesApi}/10`,
            method: 'POST',
            payload: template,
            onSuccess: onSuccess,
            dispatchPrefix: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT'
        };

        expect(
            actions.updateCommissionStatementTemplate(template, onSuccess)
        ).toEqual(expectedAction);
    });
});
