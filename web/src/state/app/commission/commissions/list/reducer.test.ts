import { Filters, SortOptions } from '@/app/table';

import { Commission } from '../';
import { defaultState, reducer } from './reducer';

describe('commission list reducer', () => {
    it('should handle COMMISSIONS_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'COMMISSIONS_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const commission: Commission = {
            id: '10',
            policyId: '99',
            commissionTypeId: '321',
            amountIncludingVAT: 100,
            vat: 14,
            userId: '123321',
            date: '2001-01-01'
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [commission]
            }
        });

        const expectedState = {
            ...defaultState,
            items: [commission],
            totalItems: 1,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const options = {
            number: 9,
            size: 20
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE',
            payload: options
        });

        const expectedState = {
            ...defaultState,
            pageOptions: {
                ...options
            }
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const options: SortOptions = {
            direction: 'asc',
            column: 'colName'
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE',
            payload: options
        });

        const expectedState = {
            ...defaultState,
            sortOptions: {
                ...options
            }
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_LIST_FILTERS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const filters: Filters = {
            firstName: ['sup']
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_LIST_FILTERS_RECEIVE',
            payload: filters
        });

        const expectedState = {
            ...defaultState,
            filters: {
                ...filters
            }
        };

        expect(actualState).toEqual(expectedState);
    });
});
