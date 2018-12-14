import { ApiAction, ApiOnSuccess, ValidationResult } from '@/app/types';
import { membersApi } from '@/config/api/member';

import { MemberEdit } from '../types';

type MemberReceiveAction = {
    type: 'MEMBERS_MEMBER_RECEIVE';
    payload: MemberEdit;
};
type MemberFetchingAction = { type: 'MEMBERS_MEMBER_FETCHING' };
type MemberFetchingErrorAction = { type: 'MEMBERS_MEMBER_FETCHING_ERROR' };

type MemberUpdatedAction = { type: 'MEMBERS_MEMBER_EDIT_RECEIVE' };
type MemberUpdatingAction = { type: 'MEMBERS_MEMBER_EDIT_FETCHING' };
type MemberUpdatingErrorAction = { type: 'MEMBERS_MEMBER_EDIT_FETCHING_ERROR' };
type MemberValidationErrorAction = {
    type: 'MEMBERS_MEMBER_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type MemberAction =
    | MemberReceiveAction
    | MemberFetchingAction
    | MemberFetchingErrorAction
    | MemberUpdatedAction
    | MemberUpdatingAction
    | MemberUpdatingErrorAction
    | MemberValidationErrorAction;

export const receiveMember = (member: MemberEdit): MemberReceiveAction => ({
    type: 'MEMBERS_MEMBER_RECEIVE',
    payload: member
});

export const fetchMember = (memberId: string): ApiAction => ({
    type: 'API',
    endpoint: `${membersApi}/${memberId}`,
    dispatchPrefix: 'MEMBERS_MEMBER'
});

export const updateMember = (
    member: MemberEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${membersApi}/${member.id}`,
    method: 'POST',
    payload: member,
    onSuccess: onSuccess,
    dispatchPrefix: 'MEMBERS_MEMBER_EDIT'
});

export const insertMember = (
    member: MemberEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${membersApi}`,
    method: 'POST',
    payload: member,
    onSuccess: onSuccess,
    dispatchPrefix: 'MEMBERS_MEMBER_EDIT'
});