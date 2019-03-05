import { Filters, SortOptions } from '@/app/table';

import { CommissionStatementTemplate } from '../';
import { defaultState, reducer } from './reducer';

describe('commission list reducer', () => {
    it('should handle COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATES_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const template: CommissionStatementTemplate = {
            id: '10',
            companyId: '99',
            name: 'Template 1'
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATES_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [template]
            }
        });

        const expectedState = {
            ...defaultState,
            items: [template],
            totalItems: 1,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
