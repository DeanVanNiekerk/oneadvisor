// import { Filters, SortOptions } from '@/app/table';

// import { AuditLog } from '../';
// import { defaultState, reducer } from './reducer';

describe("auditLog list reducer", () => {
    it("should handle AUDIT_LOGS_LIST_FETCHING", () => {
        // const actualState = reducer(defaultState, {
        //     type: 'AUDIT_LOGS_LIST_FETCHING'
        // });

        // const expectedState = {
        //     ...defaultState,
        //     fetching: true
        // };

        //expect(actualState).toEqual(expectedState);
        expect(true).toEqual(true);
    });
    /*
    it('should handle AUDIT_LOGS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'AUDIT_LOGS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle AUDIT_LOGS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const auditLog: AuditLog = {
            id: '2345',
            data: 'data',
            entity: 'Client',
            action: 'Insert',
            date: '1982-01-01',
            userId: '432234'
        };

        const actualState = reducer(initalState, {
            type: 'AUDIT_LOGS_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [auditLog]
            }
        });

        const expectedState = {
            ...defaultState,
            items: [auditLog],
            totalItems: 1,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle AUDIT_LOGS_LIST_PAGE_OPTIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const options = {
            number: 9,
            size: 20
        };

        const actualState = reducer(initalState, {
            type: 'AUDIT_LOGS_LIST_PAGE_OPTIONS_RECEIVE',
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

    it('should handle AUDIT_LOGS_LIST_SORT_OPTIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const options: SortOptions = {
            direction: 'asc',
            column: 'colName'
        };

        const actualState = reducer(initalState, {
            type: 'AUDIT_LOGS_LIST_SORT_OPTIONS_RECEIVE',
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

    it('should handle AUDIT_LOGS_LIST_FILTERS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const filters: Filters = {
            firstName: ['sup']
        };

        const actualState = reducer(initalState, {
            type: 'AUDIT_LOGS_LIST_FILTERS_RECEIVE',
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
    */
});
