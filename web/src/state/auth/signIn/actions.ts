import { Dispatch } from 'redux';

import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { signInApi } from '@/config/api/account';

import { setToken } from '../../storage';
import { recieveToken } from '../token/actions';
import { Credentials } from '../types';

type SignInAction = {
    type: "AUTH_SIGNIN_RECEIVE";
    payload: { token: string | null };
};
type SigningInAction = {
    type: "AUTH_SIGNIN_FETCHING";
};
type SigningInErrorAction = {
    type: "AUTH_SIGNIN_FETCHING_ERROR";
};
type SignInValidationErrorAction = {
    type: "AUTH_SIGNIN_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type SignInActions =
    | SignInAction
    | SigningInAction
    | SigningInErrorAction
    | SignInValidationErrorAction;

export const signIn = (
    credentials: Credentials,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${signInApi}`,
    method: "POST",
    payload: credentials,
    dispatchPrefix: "AUTH_SIGNIN",
    hideNotifications: true,
    onSuccess: (result: any, dispatch: Dispatch) => {
        dispatch(recieveToken(result.token));
        onSuccess(result, dispatch);
    },
});
