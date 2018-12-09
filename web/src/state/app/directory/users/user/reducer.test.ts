

import { reducer, defaultState } from './reducer';
import { getValidationResult } from '@/state/testUtils';

describe('user reducer', () => {
    it('should handle USERS_USER_FETCHING', () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'USERS_USER_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: []
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
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const user = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            email: 'dean@gmail.com',
            login: 'dean',
            lastLogin: '',
            lastUpdated: '',
            status: 'ACTIVE',
            organisationId: '12341234'
        };

        const actualState = reducer(initalState, {
            type: 'USERS_USER_RECEIVE',
            payload: { ...user }
        });

        const expectedState = {
            ...defaultState,
            user: { ...user },
            fetching: false,
            validationResults: []
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
