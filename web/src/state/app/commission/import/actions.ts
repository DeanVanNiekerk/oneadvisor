import { v4 } from 'uuid';

import { commissionsImportApi } from '@/config/api/commission';

import { ImportColumn, ImportCommission, ImportData, ResultFailure } from './';

type ImportDataReceiveAction = {
    type: 'COMMISSIONS_IMPORT_DATA_RECEIVE';
    payload: ImportData;
};

type ImportColumnsReceiveAction = {
    type: 'COMMISSIONS_IMPORT_COLUMNS_RECEIVE';
    payload: ImportColumn[];
};

type ImportCommissionsReceiveAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE';
    payload: ImportCommission[];
};

type ImportCommissionsRemoveAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_REMOVE';
    payload: string;
};

type ImportCommissionsDateReceiveAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE';
    payload: string;
};

type ImportCommissionsUpdateDateAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_UPDATE_DATE';
};

type ImportNextStepReceiveAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP';
};

type ImportPreviousStepReceiveAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP';
};

type ImportCommissionImportClearResultsAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSION_CLEAR_RESULTS';
};

type ImportCommissionImportSuccessAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSION_SUCCESS';
    payload: ImportCommission;
};
type ImportCommissionImportFailureAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSION_FAILURE';
    payload: ResultFailure;
};

type ImportCommissionImportResetAction = {
    type: 'COMMISSIONS_IMPORT_COMMISSION_RESET';
};

type ImportCommissionsSelectedColumnsReceiveAction = {
    type: 'COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE';
    payload: string[];
};

export type ImportCommissionAction =
    | ImportDataReceiveAction
    | ImportColumnsReceiveAction
    | ImportCommissionsReceiveAction
    | ImportCommissionsRemoveAction
    | ImportCommissionsDateReceiveAction
    | ImportNextStepReceiveAction
    | ImportPreviousStepReceiveAction
    | ImportCommissionImportSuccessAction
    | ImportCommissionImportFailureAction
    | ImportCommissionImportClearResultsAction
    | ImportCommissionsUpdateDateAction
    | ImportCommissionImportResetAction
    | ImportCommissionsSelectedColumnsReceiveAction;

export const receiveCommissionImportData = (
    data: ImportData
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_DATA_RECEIVE',
    payload: data
});

export const receiveCommissionImportColumns = (
    columns: ImportColumn[]
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COLUMNS_RECEIVE',
    payload: columns
});

export const receiveCommissionImportSelectedColumns = (
    columns: string[]
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE',
    payload: columns
});

export const receiveCommissionImportCommissions = (
    data: ImportCommission[]
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE',
    payload: data
});

export const removeCommissionImportCommission = (
    id: string
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_REMOVE',
    payload: id
});

export const receiveCommissionImportDate = (
    date: string
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE',
    payload: date
});

export const updateCommissionImportPolicyCompanies = (): ImportCommissionsUpdateDateAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_UPDATE_DATE'
});

export const commissionImportNextStep = (): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP'
});

export const commissionImportPreviousStep = (): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP'
});

export const importCommissionClearResults = (): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSION_CLEAR_RESULTS'
});

export const importCommissionReset = (): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSION_RESET'
});

export const importCommissionSuccess = (
    importCommission: ImportCommission
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSION_SUCCESS',
    payload: importCommission
});

export const importCommissionFailure = (
    importCommission: ImportCommission,
    error: string
): ImportCommissionAction => ({
    type: 'COMMISSIONS_IMPORT_COMMISSION_FAILURE',
    payload: {
        _id: v4(),
        importCommission: importCommission,
        error: error
    }
});

export const importCommission = (commission: ImportCommission): any => {
    return {
        queue: 'COMMISSIONS_IMPORT_COMMISSIONS',
        callback: (next, dispatch) => {
            dispatch({
                type: 'API',
                endpoint: `${commissionsImportApi}`,
                method: 'POST',
                payload: commission,
                hideNotifications: true,
                onSuccess: () => {
                    dispatch(importCommissionSuccess(commission));
                    next();
                },
                onFailure: error => {
                    dispatch(
                        importCommissionFailure(
                            commission,
                            JSON.stringify(error, null, 4)
                        )
                    );
                    next();
                }
            });
        }
    };
};
