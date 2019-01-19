import { getValidationResult } from '@/test';

import { defaultState, reducer } from './reducer';

const defaultUser = {
    id: '10',
    firstName: 'Dean',
    lastName: 'Jackson',
    fullName: 'DJ'
};

describe('user reducer', () => {
    it('should handle USERSSIMPLE_USER_FETCHING', () => {
        const initalState = {
            ...defaultState,
            userSimple: { ...defaultUser }
        };

        const actualState = reducer(initalState, {
            type: 'USERSSIMPLE_USER_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            userSimple: null
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERSSIMPLE_USER_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USERSSIMPLE_USER_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERSSIMPLE_USER_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USERSSIMPLE_USER_RECEIVE',
            payload: { ...defaultUser }
        });

        const expectedState = {
            ...defaultState,
            userSimple: { ...defaultUser },
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
