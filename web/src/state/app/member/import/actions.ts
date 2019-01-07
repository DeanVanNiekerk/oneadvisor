import { ImportColumn, ImportData } from './';

type ImportDataReceiveAction = {
    type: 'MEMBERS_IMPORT_DATA_RECEIVE';
    payload: ImportData;
};

type ImportColumnsReceiveAction = {
    type: 'MEMBERS_IMPORT_COLUMNS_RECEIVE';
    payload: ImportColumn[];
};

export type ImportMemberAction =
    | ImportDataReceiveAction
    | ImportColumnsReceiveAction;

export const receiveMemberImportData = (
    data: ImportData
): ImportDataReceiveAction => ({
    type: 'MEMBERS_IMPORT_DATA_RECEIVE',
    payload: data
});

export const receiveMemberImportColumns = (
    columns: ImportColumn[]
): ImportColumnsReceiveAction => ({
    type: 'MEMBERS_IMPORT_COLUMNS_RECEIVE',
    payload: columns
});
