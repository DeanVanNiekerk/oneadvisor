import moment from 'moment';
import { v4 } from 'uuid';

import { DATE_FORMAT } from '@/app/parsers';

import { ImportColumn, ImportCommission, ImportData } from './';
import { defaultState, reducer } from './reducer';

const getImportCommission = (id: string) => {
    return {
        _id: id,
        policyNumber: v4(),
        amountIncludingVAT: Math.random() * 100,
        vat: Math.random() * 10,
        commissionTypeCode: v4(),
        date: moment().format(DATE_FORMAT)
    };
};

describe('commission import reducer', () => {
    it('should handle COMMISSIONS_IMPORT_DATA_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const data: ImportData = [['val1', 'val2'], ['val3', 'val4']];

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_DATA_RECEIVE',
            payload: data
        });

        const expectedState = {
            ...defaultState,
            data: [...data]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COLUMNS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const columns: ImportColumn[] = [
            {
                id: 'policyNumber',
                name: 'Policy Number'
            }
        ];

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COLUMNS_RECEIVE',
            payload: columns
        });

        const expectedState = {
            ...defaultState,
            columns: [...columns]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            selectedColumns: []
        };

        const columns: string[] = ['idNumber'];

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE',
            payload: columns
        });

        const expectedState = {
            ...defaultState,
            selectedColumns: [...columns]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const commissions: ImportCommission[] = [getImportCommission('123456')];

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE',
            payload: commissions
        });

        const expectedState = {
            ...defaultState,
            commissions: [...commissions]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_REMOVE', () => {
        const c1 = getImportCommission('1');
        const c2 = getImportCommission('2');
        const c3 = getImportCommission('3');

        const initalState = {
            ...defaultState,
            commissions: [c1, c2, c3]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_REMOVE',
            payload: '2'
        });

        const expectedState = {
            ...defaultState,
            commissions: [c1, c3]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_REMOVE, invalid id', () => {
        const c1 = getImportCommission('1');
        const c2 = getImportCommission('2');

        const initalState = {
            ...defaultState,
            commissions: [c1, c2]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_REMOVE',
            payload: '3'
        });

        const expectedState = {
            ...defaultState,
            commissions: [c1, c2]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE',
            payload: '1988-05-06'
        });

        const expectedState = {
            ...defaultState,
            date: '1988-05-06'
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP', () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 1
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP'
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 2
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP', () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 4
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP'
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 3
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSION_SUCCESS', () => {
        const c1 = getImportCommission('1');
        const c2 = getImportCommission('2');

        const initalState = {
            ...defaultState,
            resultsSuccess: [c1]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSION_SUCCESS',
            payload: c2
        });

        const expectedState = {
            ...defaultState,
            resultsSuccess: [c1, c2]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSION_FAILURE', () => {
        const c1 = getImportCommission('1');
        const c2 = getImportCommission('2');

        const result1 = {
            _id: '1',
            importCommission: c1,
            error: 'error 1'
        };

        const result2 = {
            _id: '2',
            importCommission: c2,
            error: 'error 2'
        };

        const initalState = {
            ...defaultState,
            resultsFailure: [result1]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSION_FAILURE',
            payload: result2
        });

        const expectedState = {
            ...defaultState,
            resultsFailure: [result1, result2]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSION_FAILURE', () => {
        const c1 = getImportCommission('1');

        const result1 = {
            _id: '1',
            importCommission: c1,
            error: 'error 1'
        };

        const initalState = {
            ...defaultState,
            resultsSuccess: [c1],
            resultsFailure: [result1]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSION_CLEAR_RESULTS'
        });

        const expectedState = {
            ...defaultState,
            resultsSuccess: [],
            resultsFailure: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSIONS_UPDATE_DATE', () => {
        const c1 = getImportCommission('1');

        const initalState = {
            ...defaultState,
            date: '2000-01-02',
            commissions: [c1]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_UPDATE_DATE'
        });

        const c1Updated = {
            ...c1,
            date: '2000-01-02'
        };

        const expectedState = {
            ...defaultState,
            date: '2000-01-02',
            commissions: [c1Updated]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONS_IMPORT_COMMISSION_RESET', () => {
        const c1 = getImportCommission('1');
        const c2 = getImportCommission('2');
        const c3 = getImportCommission('3');

        const initalState = {
            ...defaultState,
            data: [['val1', 'val2'], ['val3', 'val4']],
            currentStepIndex: 1,
            date: '2000-01-26',
            commissions: [c1],
            resultsSuccess: [c2],
            resultsFailure: [
                {
                    _id: '1',
                    importCommission: c3,
                    error: 'error 1'
                }
            ]
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONS_IMPORT_COMMISSION_RESET'
        });

        const expectedState = {
            ...defaultState,
            data: [],
            commissions: [],
            resultsSuccess: [],
            resultsFailure: [],
            date: null,
            currentStepIndex: 0
        };

        expect(actualState).toEqual(expectedState);
    });
});
