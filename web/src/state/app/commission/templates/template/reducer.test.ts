import { getValidationResult } from '@/test';

import { CommissionStatementTemplateEdit } from '../';
import { defaultState, reducer } from './reducer';

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

describe('commission reducer', () => {
    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_FETCHING', () => {
        const initalState = {
            ...defaultState,
            template: { ...template },
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            template: null,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_RECEIVE',
            payload: { ...template }
        });

        const expectedState = {
            ...defaultState,
            template: { ...template },
            fetching: false,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_STATEMENT_TEMPLATE_EDIT_VALIDATION_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const validationResults = [getValidationResult()];

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_STATEMENT_TEMPLATE_EDIT_VALIDATION_ERROR',
            payload: validationResults
        });

        const expectedState = {
            ...defaultState,
            updating: false,
            validationResults: validationResults
        };

        expect(actualState).toEqual(expectedState);
    });
});
