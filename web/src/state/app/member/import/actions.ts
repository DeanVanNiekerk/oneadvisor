import { ImportColumn, ImportData, ImportMember } from './';

type ImportDataReceiveAction = {
    type: 'MEMBERS_IMPORT_DATA_RECEIVE';
    payload: ImportData;
};

type ImportColumnsReceiveAction = {
    type: 'MEMBERS_IMPORT_COLUMNS_RECEIVE';
    payload: ImportColumn[];
};

type ImportMembersReceiveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_RECEIVE';
    payload: ImportMember[];
};

type ImportMembersRemoveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_REMOVE';
    payload: string;
};

type ImportMembersPolicyCompanyReceiveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE';
    payload: string;
};

export type ImportMemberAction =
    | ImportDataReceiveAction
    | ImportColumnsReceiveAction
    | ImportMembersReceiveAction
    | ImportMembersRemoveAction
    | ImportMembersPolicyCompanyReceiveAction;

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

export const receiveMemberImportMembers = (
    data: ImportMember[]
): ImportMembersReceiveAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_RECEIVE',
    payload: data
});

export const removeMemberImportMember = (
    id: string
): ImportMembersRemoveAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_REMOVE',
    payload: id
});

export const receiveMemberImportPolicyCompany = (
    companyId: string
): ImportMembersPolicyCompanyReceiveAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE',
    payload: companyId
});
