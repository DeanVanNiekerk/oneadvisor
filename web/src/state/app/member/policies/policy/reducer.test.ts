import { getValidationResult } from '@/test';

import { PolicyEdit } from '../';
import { defaultState, reducer } from './reducer';

const defaultPolicy: PolicyEdit = {
    id: '10',
    memberId: '12',
    companyId: '100',
    userId: '1',
    number: '987654',
    premium: 500,
    startDate: '1999-01-01'
};

describe('policy reducer', () => {
    it('should handle POLICIES_POLICY_FETCHING', () => {
        const initalState = {
            ...defaultState,
            policy: { ...defaultPolicy },
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'POLICIES_POLICY_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            policy: null,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle POLICIES_POLICY_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'POLICIES_POLICY_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle POLICIES_POLICY_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'POLICIES_POLICY_RECEIVE',
            payload: { ...defaultPolicy }
        });

        const expectedState = {
            ...defaultState,
            policy: { ...defaultPolicy },
            fetching: false,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle POLICIES_POLICY_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'POLICIES_POLICY_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle POLICIES_POLICY_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'POLICIES_POLICY_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle POLICIES_POLICY_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'POLICIES_POLICY_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
