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

type ImportNextStepReceiveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP';
};

type ImportPreviousStepReceiveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP';
};

export type ImportMemberAction =
    | ImportDataReceiveAction
    | ImportColumnsReceiveAction
    | ImportMembersReceiveAction
    | ImportMembersRemoveAction
    | ImportMembersPolicyCompanyReceiveAction
    | ImportNextStepReceiveAction
    | ImportPreviousStepReceiveAction;

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

export const memberImportNextStep = (): ImportNextStepReceiveAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP'
});

export const memberImportPreviousStep = (): ImportPreviousStepReceiveAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP'
});
