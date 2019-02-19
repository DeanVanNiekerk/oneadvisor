import { getValidationResult } from '@/test';

import { CommissionError } from '../types';
import { defaultState, reducer } from './reducer';

const defaultCommissionError: CommissionError = {
    id: '10',
    commissionStatementId: '321',
    policyId: '12',
    memberId: '13',
    commissionTypeId: '14',
    data: `{ "key": "value1" }`,
    isFormatValid: false
};

describe('commission format error reducer', () => {
    it('should handle COMMISSIONS_ERROR_FORMAT_FETCHING', () => {
        const initalState = {
            ...defaultState,
            commissionError: { ...defaultCommissionError },
            commissionErrorData: JSON.parse(defaultCommissionError.data),
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_ERROR_FORMAT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            commissionError: null,
            commissionErrorData: null,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_ERROR_FORMAT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_ERROR_FORMAT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_ERROR_FORMAT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_ERROR_FORMAT_RECEIVE',
            payload: { ...defaultCommissionError }
        });

        const expectedState = {
            ...defaultState,
            commissionError: { ...defaultCommissionError },
            commissionErrorData: JSON.parse(defaultCommissionError.data),
            fetching: false,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_ERROR_FORMAT_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_ERROR_FORMAT_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_ERROR_FORMAT_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
