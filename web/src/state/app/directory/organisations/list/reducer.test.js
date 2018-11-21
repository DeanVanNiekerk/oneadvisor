// @flow

import { reducer, defaultState } from './reducer';
import * as types from './actions';

describe('organisation list reducer', () => {
    it('should handle ORGANISATIONS_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'ORGANISATIONS_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ORGANISATIONS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'ORGANISATIONS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ORGANISATIONS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const organisation = {
            id: '10',
            name: 'Org1'
        };

        const actualState = reducer(initalState, {
            type: 'ORGANISATIONS_LIST_RECEIVE',
            payload: [organisation]
        });

        const expectedState = {
            ...defaultState,
            items: [organisation],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
