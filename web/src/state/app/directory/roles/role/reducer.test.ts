import { getValidationResult } from '@/state/testUtils';

import { defaultState, reducer } from './reducer';

describe('role reducer', () => {
    it('should handle ROLES_ROLE_FETCHING', () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_ROLE_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_ROLE_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_ROLE_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_ROLE_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const role = {
            id: '10',
            name: 'Org1',
            applicationId: "app_1",
            useCaseIds: ["uc1"]
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_ROLE_RECEIVE',
            payload: { ...role }
        });

        const expectedState = {
            ...defaultState,
            role: { ...role },
            fetching: false,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_ROLE_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'ROLES_ROLE_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_ROLE_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_ROLE_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle ROLES_ROLE_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'ROLES_ROLE_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
