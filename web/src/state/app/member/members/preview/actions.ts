import { ApiAction } from '@/app/types';
import { membersApi } from '@/config/api/member';

import { MemberPreview } from '../types';

type MemberPreviewReceiveAction = {
    type: 'MEMBERS_MEMBER_PREVIEW_RECEIVE';
    payload: MemberPreview;
};
type MemberPreviewFetchingAction = { type: 'MEMBERS_MEMBER_PREVIEW_FETCHING' };
type MemberPreviewFetchingErrorAction = {
    type: 'MEMBERS_MEMBER_PREVIEW_FETCHING_ERROR';
};

export type MemberPreviewAction =
    | MemberPreviewReceiveAction
    | MemberPreviewFetchingAction
    | MemberPreviewFetchingErrorAction;

export const receiveMemberPreview = (
    member: MemberPreview
): MemberPreviewReceiveAction => ({
    type: 'MEMBERS_MEMBER_PREVIEW_RECEIVE',
    payload: member
});

export const fetchMemberPreview = (memberId: string): ApiAction => ({
    type: 'API',
    endpoint: `${membersApi}/${memberId}/preview`,
    dispatchPrefix: 'MEMBERS_MEMBER_PREVIEW'
});
