import { User } from '../';
import { defaultState, reducer } from './reducer';

describe('user list reducer', () => {
    it('should handle USERS_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'USERS_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USERS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const user: User = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            email: 'dean@gmail.com',
            login: 'dean',
            lastLogin: '',
            lastUpdated: '',
            status: 'ACTIVE',
            organisationId: '432221',
            branchId: '12341234',
            isSynced: false
        };

        const actualState = reducer(initalState, {
            type: 'USERS_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [user]
            }
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [user],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
