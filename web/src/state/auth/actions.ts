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
type SignInFailedAction = {
    type: 'AUTH_SIGNIN_FAILED';
};

export type Action =
    | SignInAction
    | SigningInAction
    | SigningInErrorAction
    | SignInValidationErrorAction
    | SignInFailedAction;

export const signIn = (credentials: Credentials): ApiAction => ({
    type: 'API',
    endpoint: `${signInApi}`,
    method: 'POST',
    payload: credentials,
    dispatchPrefix: 'AUTH_SIGNIN',
    onSuccess: (result: any) => {
        setToken(result.token);
        setIdentity(result.identity);
    }
});

export const signOut = (): Action => ({
    type: 'AUTH_SIGNIN_RECEIVE',
    payload: {
        token: null,
        identity: null
    }
});
