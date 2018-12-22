import { ApiAction, ApiOnSuccess } from '@/app/types';
import { usersApi } from '@/config/api/directory';

import { UserSimple } from '../types';

type UserReceiveAction = {
    type: 'USERSSIMPLE_USER_RECEIVE';
    payload: UserSimple | null;
};
type UserFetchingAction = { type: 'USERSSIMPLE_USER_FETCHING' };
type UserFetchingErrorAction = { type: 'USERSSIMPLE_USER_FETCHING_ERROR' };

export type UserSimpleAction =
    | UserReceiveAction
    | UserFetchingAction
    | UserFetchingErrorAction;

export const fetchUserSimple = (userId: string): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}/simple/${userId}`,
    dispatchPrefix: 'USERSSIMPLE_USER'
});

export const receiveUserSimple = (
    user: UserSimple | null
): UserReceiveAction => ({
    type: 'USERSSIMPLE_USER_RECEIVE',
    payload: user
});
