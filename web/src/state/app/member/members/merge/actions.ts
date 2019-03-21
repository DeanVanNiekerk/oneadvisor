import { appendFiltersQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { membersApi, mergeApi } from '@/config/api/member';

import { Member } from '../';

type MemberMergeReceiveAction = {
    type: "MEMBERS_MERGE_RECEIVE";
    payload: PagedItems<Member>;
};
type MemberMergeFetchingAction = { type: "MEMBERS_MERGE_FETCHING" };
type MemberMergeFetchingErrorAction = { type: "MEMBERS_MERGE_FETCHING_ERROR" };

type MemberMergeNextStepReceiveAction = {
    type: "MEMBERS_MERGE_NEXT_STEP";
};

type MemberMergePreviousStepReceiveAction = {
    type: "MEMBERS_MERGE_PREVIOUS_STEP";
};

type MemberMergeResetAction = {
    type: "MEMBERS_MERGE_RESET";
};

type MemberMergeInsertedReceiveAction = {
    type: "MEMBERS_MERGE_INSERTED_RECEIVE";
    payload: Member;
};

export type MemberMergeAction =
    | MemberMergeReceiveAction
    | MemberMergeFetchingAction
    | MemberMergeFetchingErrorAction
    | MemberMergeNextStepReceiveAction
    | MemberMergePreviousStepReceiveAction
    | MemberMergeResetAction
    | MemberMergeInsertedReceiveAction;

export const fetchMergeMembers = (memberIds: string[]): ApiAction => {
    let api = membersApi;
    const filters: Filters = {
        memberId: memberIds,
    };
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "MEMBERS_MERGE",
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

export const receiveMemberMergeInserted = (
    member: Member
): MemberMergeAction => ({
    type: "MEMBERS_MERGE_INSERTED_RECEIVE",
    payload: member,
});
