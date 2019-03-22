import { Dispatch } from 'redux';

import { appendFiltersQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction, ApiOnSuccess, Result } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { membersApi, mergeApi } from '@/config/api/member';

import { Member, MemberEdit, MergeMembers, receiveMemberValidationResults } from '../';

type MemberMergeSourceReceiveAction = {
    type: "MEMBERS_MERGE_SOURCE_RECEIVE";
    payload: PagedItems<Member>;
};
type MemberMergeSourceFetchingAction = {
    type: "MEMBERS_MERGE_SOURCE_FETCHING";
};
type MemberMergeSourceFetchingErrorAction = {
    type: "MEMBERS_MERGE_SOURCE_FETCHING_ERROR";
};

type MemberMergeNextStepReceiveAction = {
    type: "MEMBERS_MERGE_NEXT_STEP";
};

type MemberMergePreviousStepReceiveAction = {
    type: "MEMBERS_MERGE_PREVIOUS_STEP";
};

type MemberMergeResetAction = {
    type: "MEMBERS_MERGE_RESET";
};

type MemberMergeReceiveAction = {
    type: "MEMBERS_MERGE_RECEIVE";
    payload: Result<MemberEdit>;
};
type MemberMergeFetchingAction = {
    type: "MEMBERS_MERGE_FETCHING";
};
type MemberMergeFetchingErrorAction = {
    type: "MEMBERS_MERGE_FETCHING_ERROR";
};
type MemberMergeValidationErrorAction = {
    type: "MEMBERS_MERGE_VALIDATION_ERROR";
};

export type MemberMergeAction =
    | MemberMergeReceiveAction
    | MemberMergeFetchingAction
    | MemberMergeFetchingErrorAction
    | MemberMergeValidationErrorAction
    | MemberMergeSourceReceiveAction
    | MemberMergeSourceFetchingAction
    | MemberMergeSourceFetchingErrorAction
    | MemberMergeNextStepReceiveAction
    | MemberMergePreviousStepReceiveAction
    | MemberMergeResetAction;

export const fetchMergeMembers = (memberIds: string[]): ApiAction => {
    let api = membersApi;
    const filters: Filters = {
        memberId: memberIds,
    };
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "MEMBERS_MERGE_SOURCE",
    };
};

export const memberMergeNextStep = (): MemberMergeAction => ({
    type: "MEMBERS_MERGE_NEXT_STEP",
});

export const memberMergePreviousStep = (): MemberMergeAction => ({
    type: "MEMBERS_MERGE_PREVIOUS_STEP",
});

export const memberMergeReset = (): MemberMergeAction => ({
    type: "MEMBERS_MERGE_RESET",
});

export const mergeMembers = (
    merge: MergeMembers,
    onSuccess: ApiOnSuccess
): ApiAction => {
    return {
        type: "API",
        method: "POST",
        endpoint: mergeApi,
        payload: merge,
        dispatchPrefix: "MEMBERS_MERGE",
        onSuccess: onSuccess,
        onValidationFailure: (
            validationResults: ValidationResult[],
            dispatch: Dispatch
        ) => {
            dispatch(receiveMemberValidationResults(validationResults));
        },
    };
};
