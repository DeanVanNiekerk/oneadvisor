import { membersApi } from '@/config/api/member';
import { ApiAction, PagedItems } from '@/state/types';

import { Member } from '../types';

type MemberListReceiveAction = {
    type: 'MEMBERS_LIST_RECEIVE';
    payload: PagedItems<Member>;
};
type MemberListFetchingAction = { type: 'MEMBERS_LIST_FETCHING' };
type MemberListFetchingErrorAction = { type: 'MEMBERS_LIST_FETCHING_ERROR' };

export type Action =
    | MemberListReceiveAction
    | MemberListFetchingAction
    | MemberListFetchingErrorAction;

export const fetchMembers = (): ApiAction => ({
    type: 'API',
    endpoint: membersApi,
    dispatchPrefix: 'MEMBERS_LIST'
});
