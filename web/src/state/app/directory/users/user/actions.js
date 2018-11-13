// @flow

import { RSAA } from 'redux-api-middleware';
import { usersApi } from '@/config/api/directory';
import type { User } from '../types';

type UserReceiveAction = { type: 'USERS_USER_RECEIVE', payload: User };
type UserFetchingAction = { type: 'USERS_USER_FETCHING' };
type UserFetchingErrorAction = { type: 'USERS_USER_FETCHING_ERROR' };

export type Action =
    | UserReceiveAction
    | UserFetchingAction
    | UserFetchingErrorAction;

export const fetchUser = (userId: string) => ({
    [RSAA]: {
        endpoint: `${usersApi}/${userId}`,
        method: 'GET',
        types: [
            'USERS_USER_FETCHING',
            'USERS_USER_RECEIVE',
            'USERS_USER_FETCHING_ERROR'
        ]
    }
});
