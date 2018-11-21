// @flow

import { reducer, defaultState } from './reducer';
import * as types from './actions';

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

        const user = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            email: 'dean@gmail.com',
            login: 'dean',
            lastLogin: '',
            lastUpdated: '',
            lastUpdated: '',
            status: 'ACTIVE',
            organisationId: '12341234'
        };

        const actualState = reducer(initalState, {
            type: 'USERS_LIST_RECEIVE',
            payload: [user]
        });

        const expectedState = {
            ...defaultState,
            items: [user],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
