

import { ApiAction, ApiOnSuccess, ValidationResult } from '@/state/types';
import { usersApi } from '@/config/api/directory';
import { User } from '../types';

type UserReceiveAction = { type: 'USERS_USER_RECEIVE', payload: User };
type UserFetchingAction = { type: 'USERS_USER_FETCHING' };
type UserFetchingErrorAction = { type: 'USERS_USER_FETCHING_ERROR' };

type UserUpdatedAction = { type: 'USERS_USER_EDIT_RECEIVE' };
type UserUpdatingAction = { type: 'USERS_USER_EDIT_FETCHING' };
type UserUpdatingErrorAction = { type: 'USERS_USER_EDIT_FETCHING_ERROR' };
type UserValidationErrorAction = {
    type: 'USERS_USER_EDIT_VALIDATION_ERROR',
    payload: ValidationResult[]
};

export type Action =
    | UserReceiveAction
    | UserFetchingAction
    | UserFetchingErrorAction
    | UserUpdatedAction
    | UserUpdatingAction
    | UserUpdatingErrorAction
    | UserValidationErrorAction;

export const receiveUser = (user: User): UserReceiveAction => ({
    type: 'USERS_USER_RECEIVE',
    payload: user
});

export const fetchUser = (userId: string): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}/${userId}`,
    dispatchPrefix: 'USERS_USER'
});

export const updateUser = (user: User, onSuccess: ApiOnSuccess): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}/${user.id}`,
    method: 'POST',
    payload: user,
    onSuccess: onSuccess,
    dispatchPrefix: 'USERS_USER_EDIT'
});

export const insertUser = (user: User, onSuccess: ApiOnSuccess): ApiAction => ({
    type: 'API',
    endpoint: `${usersApi}`,
    method: 'POST',
    payload: user,
    onSuccess: onSuccess,
    dispatchPrefix: 'USERS_USER_EDIT'
});