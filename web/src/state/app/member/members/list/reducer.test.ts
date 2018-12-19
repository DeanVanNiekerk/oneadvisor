import { Filters, SortOptions } from '@/app/table';

import { defaultState, reducer } from './reducer';

describe('member list reducer', () => {
    it('should handle MEMBERS_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'MEMBERS_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const member = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            maidenName: '',
            initials: 'DJ',
            preferredName: 'ripper',
            idNumber: '12341234',
            dateOfBirth: '1982-10-03'
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [member]
            }
        });

        const expectedState = {
            ...defaultState,
            items: [member],
            totalItems: 1,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_LIST_PAGE_OPTIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const options = {
            number: 9,
            size: 20
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_PAGE_OPTIONS_RECEIVE',
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

    it('should handle MEMBERS_LIST_SORT_OPTIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const options: SortOptions = {
            direction: 'asc',
            column: 'colName'
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_SORT_OPTIONS_RECEIVE',
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

    it('should handle MEMBERS_LIST_FILTERS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const filters: Filters = {
            firstName: ['sup']
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_FILTERS_RECEIVE',
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
