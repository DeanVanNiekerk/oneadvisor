import moment from 'moment';
import { v4 } from 'uuid';

import { DATE_FORMAT } from '@/app/parsers';

import { ImportData } from './';
import * as actions from './actions';
import { ImportColumn, ImportCommission } from './types';

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

describe('commission: import: actions', () => {
    it('should dispatch COMMISSIONS_IMPORT_DATA_RECEIVE when receiveCommissionImportData is called', () => {
        const data: ImportData = [['val1', 'val2'], ['val3', 'val4']];

        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_DATA_RECEIVE',
            payload: data
        };

        expect(actions.receiveCommissionImportData(data)).toEqual(
            expectedAction
        );
    });

    it('should dispatch COMMISSIONS_IMPORT_COLUMNS_RECEIVE when receiveCommissionImportColumns is called', () => {
        const columns: ImportColumn[] = [
            {
                id: 'idNumber',
                name: 'ID Number'
            }
        ];

        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_COLUMNS_RECEIVE',
            payload: columns
        };

        expect(actions.receiveCommissionImportColumns(columns)).toEqual(
            expectedAction
        );
    });

    it('should dispatch COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE when receiveCommissionImportSelectedColumns is called', () => {
        const columns: string[] = ['idNumber'];

        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE',
            payload: columns
        };

        expect(actions.receiveCommissionImportSelectedColumns(columns)).toEqual(
            expectedAction
        );
    });

    it('should dispatch COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE when receiveCommissionImportCommissions is called', () => {
        const commissions: ImportCommission[] = [getImportCommission('1')];

        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE',
            payload: commissions
        };

        expect(actions.receiveCommissionImportCommissions(commissions)).toEqual(
            expectedAction
        );
    });

    it('should dispatch COMMISSIONS_IMPORT_COMMISSIONS_REMOVE when removeCommissionImportCommission is called', () => {
        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_REMOVE',
            payload: '123'
        };

        expect(actions.removeCommissionImportCommission('123')).toEqual(
            expectedAction
        );
    });

    it('should dispatch COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE when receiveCommissionImportDate is called', () => {
        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE',
            payload: '1982-01-01'
        };

        expect(actions.receiveCommissionImportDate('1982-01-01')).toEqual(
            expectedAction
        );
    });

    it('should dispatch COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP when commissionImportNextStep is called', () => {
        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP'
        };

        expect(actions.commissionImportNextStep()).toEqual(expectedAction);
    });

    it('should dispatch COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP when commissionImportPreviousStep is called', () => {
        const expectedAction = {
            type: 'COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP'
        };

        expect(actions.commissionImportPreviousStep()).toEqual(expectedAction);
    });
});
