import { statementsApi } from '@/config/api/commission';

import { StatementEdit } from '../';
import * as actions from './actions';

describe('statement actions', () => {
    it('should dispatch API when fetchStatement is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${statementsApi}/99`,
            dispatchPrefix: 'STATEMENTS_STATEMENT'
        };

        expect(actions.fetchStatement('99')).toEqual(expectedAction);
    });

    it('should dispatch API when updateStatement is called', () => {
        const statement: StatementEdit = {
            id: '10',
            companyId: '321',
            processed: false,
            amountIncludingVAT: 100,
            vat: 14,
            date: '2001-01-01'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${statementsApi}/10`,
            method: 'POST',
            payload: statement,
            onSuccess: onSuccess,
            dispatchPrefix: 'STATEMENTS_STATEMENT_EDIT'
        };

        expect(actions.updateStatement(statement, onSuccess)).toEqual(
            expectedAction
        );
    });
});
