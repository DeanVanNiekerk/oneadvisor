// @flow

import { reducer, defaultState } from './reducer';
import * as types from './actions';

describe('user reducer', () => {
    it('should handle USERS_USER_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'USERS_USER_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_USER_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USERS_USER_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_USER_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USERS_USER_RECEIVE',
            payload: { id: '123', firstName: 'Indie', lastName: 'Jones' }
        });

        const expectedState = {
            ...defaultState,
            user: { id: '123', firstName: 'Indie', lastName: 'Jones' },
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_USER_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'USERS_USER_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_USER_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'USERS_USER_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERS_USER_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'USERS_USER_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
