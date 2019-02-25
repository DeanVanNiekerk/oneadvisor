import { defaultState, reducer } from './reducer';

describe('role list reducer', () => {
    it('should handle ROLES_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'ROLES_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const role = {
            id: '10',
            name: 'Role1',
            description: 'Role1 Desc',
            applicationId: 'app_1'
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_LIST_RECEIVE',
            payload: [role]
        });

        const expectedState = {
            ...defaultState,
            items: [role],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
