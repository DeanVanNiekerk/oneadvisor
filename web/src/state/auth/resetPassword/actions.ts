import { Dispatch } from 'redux';

import { ApiAction, ApiOnFailure, ApiOnSuccess, Result } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { resetPasswordApi, resetPasswordRequestApi } from '@/config/api/account';
import { setToken } from '@/state/storage';

import { recieveToken } from '../';
import { ResetPasswordData, ResetPasswordRequestData } from '../types';

type ResetPasswordAction = {
    type: "AUTH_RESETPASSWORD_RECEIVE";
    payload: Result;
};
type ResettingPasswordAction = {
    type: "AUTH_RESETPASSWORD_FETCHING";
};
type ResetPasswordErrorAction = {
    type: "AUTH_RESETPASSWORD_FETCHING_ERROR";
};
type ResetPasswordValidationErrorAction = {
    type: "AUTH_RESETPASSWORD_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type Action =
    | ResetPasswordAction
    | ResettingPasswordAction
    | ResetPasswordErrorAction
    | ResetPasswordValidationErrorAction;

export const resetPassword = (
    data: ResetPasswordData,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${resetPasswordApi}`,
    method: "POST",
    payload: data,
    dispatchPrefix: "AUTH_RESETPASSWORD",
    hideValidationNotifications: true,
    onSuccess: (result: Result, dispatch: Dispatch) => {
        dispatch(recieveToken(result.tag));
        onSuccess(result, dispatch);
    },
});

export const resetPasswordRequest = (
    data: ResetPasswordRequestData,
    onSuccess: ApiOnSuccess,
    onFailure: ApiOnFailure
): ApiAction => ({
    type: "API",
    endpoint: `${resetPasswordRequestApi}`,
    method: "POST",
    payload: data,
    onSuccess: onSuccess,
    onFailure: onFailure,
});
