import { V4MAPPED } from 'dns';
import { v4 } from 'uuid';

import { ValidationResult } from '@/app/validation';
import { membersImportApi } from '@/config/api/member';

import { ImportColumn, ImportData, ImportMember, ResultFailure } from './';

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

type ImportMembersUpdatePolicyCompaniesAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_UPDATE_POLICY_COMPANIES';
};

type ImportNextStepReceiveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP';
};

type ImportPreviousStepReceiveAction = {
    type: 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP';
};

type ImportMemberImportClearResultsAction = {
    type: 'MEMBERS_IMPORT_MEMBER_CLEAR_RESULTS';
};

type ImportMemberImportSuccessAction = {
    type: 'MEMBERS_IMPORT_MEMBER_SUCCESS';
    payload: ImportMember;
};
type ImportMemberImportFailureAction = {
    type: 'MEMBERS_IMPORT_MEMBER_FAILURE';
    payload: ResultFailure;
};

export type ImportMemberAction =
    | ImportDataReceiveAction
    | ImportColumnsReceiveAction
    | ImportMembersReceiveAction
    | ImportMembersRemoveAction
    | ImportMembersPolicyCompanyReceiveAction
    | ImportNextStepReceiveAction
    | ImportPreviousStepReceiveAction
    | ImportMemberImportSuccessAction
    | ImportMemberImportFailureAction
    | ImportMemberImportClearResultsAction
    | ImportMembersUpdatePolicyCompaniesAction;

export const receiveMemberImportData = (
    data: ImportData
): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_DATA_RECEIVE',
    payload: data
});

export const receiveMemberImportColumns = (
    columns: ImportColumn[]
): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_COLUMNS_RECEIVE',
    payload: columns
});

export const receiveMemberImportMembers = (
    data: ImportMember[]
): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_RECEIVE',
    payload: data
});

export const removeMemberImportMember = (id: string): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_REMOVE',
    payload: id
});

export const receiveMemberImportPolicyCompany = (
    companyId: string
): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE',
    payload: companyId
});

export const updateMemberImportPolicyCompanies = (): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_UPDATE_POLICY_COMPANIES'
});

export const memberImportNextStep = (): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP'
});

export const memberImportPreviousStep = (): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP'
});

export const importMemberClearResults = (): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBER_CLEAR_RESULTS'
});

export const importMemberSuccess = (
    importMember: ImportMember
): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBER_SUCCESS',
    payload: importMember
});

export const importMemberFailure = (
    importMember: ImportMember,
    error: string
): ImportMemberAction => ({
    type: 'MEMBERS_IMPORT_MEMBER_FAILURE',
    payload: {
        _id: v4(),
        importMember: importMember,
        error: error
    }
});

export const importMember = (member: ImportMember): any => {
    return {
        queue: 'MEMBERS_IMPORT_MEMBERS',
        callback: (next, dispatch, getState) => {
            dispatch({
                type: 'API',
                endpoint: `${membersImportApi}`,
                method: 'POST',
                payload: member,
                hideNotifications: true,
                onSuccess: () => {
                    dispatch(importMemberSuccess(member));
                    next();
                },
                onFailure: error => {
                    dispatch(
                        importMemberFailure(
                            member,
                            JSON.stringify(error, null, 4)
                        )
                    );
                    next();
                }
            });
        }
    };
};
