import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { usersApi } from '@/config/api/directory';

import { UserEdit } from '../types';

type UserReceiveAction = { type: 'USERS_USER_RECEIVE'; payload: UserEdit };
type UserFetchingAction = { type: 'USERS_USER_FETCHING' };
type UserFetchingErrorAction = { type: 'USERS_USER_FETCHING_ERROR' };

type UserUpdatedAction = { type: 'USERS_USER_EDIT_RECEIVE' };
type UserUpdatingAction = { type: 'USERS_USER_EDIT_FETCHING' };
type UserUpdatingErrorAction = { type: 'USERS_USER_EDIT_FETCHING_ERROR' };
type UserValidationErrorAction = {
    type: 'USERS_USER_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type UserAction =
    | UserReceiveAction
    | UserFetchingAction
    | UserFetchingErrorAction
    | UserUpdatedAction
    | UserUpdatingAction
    | UserUpdatingErrorAction
    | UserValidationErrorAction;

export const receiveUser = (user: UserEdit): UserReceiveAction => ({
    type: 'USERS_USER_RECEIVE',
    payload: user
});

export const fetchUser = (userId: string): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}/${userId}`,
    dispatchPrefix: 'USERS_USER'
});

export const updateUser = (
    user: UserEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}/${user.id}`,
    method: 'POST',
    payload: user,
    onSuccess: onSuccess,
    dispatchPrefix: 'USERS_USER_EDIT'
});

export const insertUser = (
    user: UserEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}`,
    method: 'POST',
    payload: user,
    onSuccess: onSuccess,
    dispatchPrefix: 'USERS_USER_EDIT'
});
