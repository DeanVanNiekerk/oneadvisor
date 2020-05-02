import { ApiAction, ApiOnSuccess, Result } from "@/app/types";
import { ValidationResult } from "@/app/validation/types";
import { usersApi } from "@/config/api/directory";

import { UserEdit } from "../types";

export type UserReceiveAction = { type: "USERS_USER_RECEIVE"; payload: UserEdit | null };
export type UserModifiedAction = {
    type: "USERS_USER_MODIFIED";
    payload: UserEdit;
};
export type UserVisibleAction = {
    type: "USERS_USER_VISIBLE";
    payload: boolean;
};
export type UserFetchingAction = { type: "USERS_USER_FETCHING" };
export type UserFetchingErrorAction = { type: "USERS_USER_FETCHING_ERROR" };

export type UserUpdatedAction = { type: "USERS_USER_EDIT_RECEIVE" };
export type UserUpdatingAction = { type: "USERS_USER_EDIT_FETCHING" };
export type UserUpdatingErrorAction = { type: "USERS_USER_EDIT_FETCHING_ERROR" };
export type UserValidationErrorAction = {
    type: "USERS_USER_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type UserAction =
    | UserReceiveAction
    | UserModifiedAction
    | UserVisibleAction
    | UserFetchingAction
    | UserFetchingErrorAction
    | UserUpdatedAction
    | UserUpdatingAction
    | UserUpdatingErrorAction
    | UserValidationErrorAction;

export const receiveUser = (user: UserEdit | null): UserReceiveAction => ({
    type: "USERS_USER_RECEIVE",
    payload: user,
});

export const modifyUser = (user: UserEdit): UserModifiedAction => ({
    type: "USERS_USER_MODIFIED",
    payload: user,
});

export const userVisible = (visible: boolean): UserVisibleAction => ({
    type: "USERS_USER_VISIBLE",
    payload: visible,
});

export const fetchUser = (userId: string): ApiAction => ({
    type: "API",
    endpoint: `${usersApi}/${userId}`,
    dispatchPrefix: "USERS_USER",
});

export const updateUser = (user: UserEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${usersApi}/${user.id}`,
    method: "POST",
    payload: user,
    onSuccess: onSuccess,
    dispatchPrefix: "USERS_USER_EDIT",
});

export const insertUser = (
    user: UserEdit,
    onSuccess?: ApiOnSuccess<Result<UserEdit>>
): ApiAction => ({
    type: "API",
    endpoint: `${usersApi}`,
    method: "POST",
    payload: user,
    onSuccess: onSuccess,
    dispatchPrefix: "USERS_USER_EDIT",
});
