import { Dispatch } from 'redux';

import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { signInApi } from '@/config/api/account';

import { setIdentity, setToken } from '../storage';
import { Credentials, Identity } from './types';

type SignInAction = {
    type: 'AUTH_SIGNIN_RECEIVE';
    payload: { token: string | null; identity: Identity | null };
};
type SigningInAction = {
    type: 'AUTH_SIGNIN_FETCHING';
};
type SigningInErrorAction = {
    type: 'AUTH_SIGNIN_FETCHING_ERROR';
};
type SignInValidationErrorAction = {
    type: 'AUTH_SIGNIN_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type Action =
    | SignInAction
    | SigningInAction
    | SigningInErrorAction
    | SignInValidationErrorAction;

export const signIn = (
    credentials: Credentials,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${signInApi}`,
    method: 'POST',
    payload: credentials,
    dispatchPrefix: 'AUTH_SIGNIN',
    hideNotifications: true,
    onSuccess: (result: any, dispatch: Dispatch) => {
        setToken(result.token);
        setIdentity(result.identity);
        onSuccess(result, dispatch);
    }
});

export const signOut = (): Action => {
    setToken(null);
    setIdentity(null);
    return {
        type: 'AUTH_SIGNIN_RECEIVE',
        payload: {
            token: null,
            identity: null
        }
    };
};
