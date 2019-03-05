import { getValidationResult } from '@/test';

import { defaultState, reducer } from './reducer';

describe('commissionType reducer', () => {
    it('should handle COMMISSIONTYPES_COMMISSIONTYPE_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()]
        };

        const commissionType = {
            id: '10',
            policyTypeId: '123',
            name: 'Type 1',
            code: 'type_1'
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONTYPES_COMMISSIONTYPE_RECEIVE',
            payload: { ...commissionType }
        });

        const expectedState = {
            ...defaultState,
            commissionType: { ...commissionType },
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONTYPES_COMMISSIONTYPE_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONTYPES_COMMISSIONTYPE_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONTYPES_COMMISSIONTYPE_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
