// @flow

import type { ApiAction } from '@/state/types';
import { usersApi } from '@/config/api/directory';
import type { User } from '../types';

type UserListReceiveAction = { type: 'USERS_LIST_RECEIVE', payload: User[] };
type UserListFetchingAction = { type: 'USERS_LIST_FETCHING' };
type UserListFetchingErrorAction = { type: 'USERS_LIST_FETCHING_ERROR' };

export type Action =
    | UserListReceiveAction
    | UserListFetchingAction
    | UserListFetchingErrorAction;

export const fetchUsers = (): ApiAction => ({
    type: 'API',
    endpoint: usersApi,
    dispatchPrefix: 'USERS_LIST'
});
