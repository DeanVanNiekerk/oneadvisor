// @flow

import { RSAA } from 'redux-api-middleware';
import { usersApi } from '@/config/api/directory';
import type { User } from '../types';

type UserListReceiveAction = { type: 'USERS_LIST_RECEIVE', payload: User[] };
type UserListFetchingAction = { type: 'USERS_LIST_FETCHING' };
type UserListFetchingErrorAction = { type: 'USERS_LIST_FETCHING_ERROR' };

export type Action =
    | UserListReceiveAction
    | UserListFetchingAction
    | UserListFetchingErrorAction;

export const fetchUsers = () => ({
    [RSAA]: {
        endpoint: usersApi,
        method: 'GET',
        types: [
            'USERS_LIST_FETCHING',
            'USERS_LIST_RECEIVE',
            'USERS_LIST_FETCHING_ERROR'
        ]
    }
});
