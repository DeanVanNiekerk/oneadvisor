import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { rolesApi } from "@/config/api/directory";

import { RoleEdit } from "../types";

type RoleReceiveAction = {
    type: "ROLES_ROLE_RECEIVE";
    payload: RoleEdit;
};
type RoleFetchingAction = {
    type: "ROLES_ROLE_FETCHING";
};
type RoleFetchingErrorAction = {
    type: "ROLES_ROLE_FETCHING_ERROR";
};

type RoleUpdatedAction = {
    type: "ROLES_ROLE_EDIT_RECEIVE";
};
type RoleUpdatingAction = {
    type: "ROLES_ROLE_EDIT_FETCHING";
};
type RoleUpdatingErrorAction = {
    type: "ROLES_ROLE_EDIT_FETCHING_ERROR";
};
type RoleValidationErrorAction = {
    type: "ROLES_ROLE_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type RoleAction =
    | RoleReceiveAction
    | RoleFetchingAction
    | RoleFetchingErrorAction
    | RoleUpdatedAction
    | RoleUpdatingAction
    | RoleUpdatingErrorAction
    | RoleValidationErrorAction;

export const receiveRole = (role: RoleEdit): RoleReceiveAction => ({
    type: "ROLES_ROLE_RECEIVE",
    payload: role,
});

export const fetchRole = (roleId: string): ApiAction => ({
    type: "API",
    endpoint: `${rolesApi}/${roleId}`,
    dispatchPrefix: "ROLES_ROLE",
});

export const updateRole = (role: RoleEdit, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${rolesApi}/${role.id}`,
    method: "POST",
    payload: role,
    onSuccess: onSuccess,
    dispatchPrefix: "ROLES_ROLE_EDIT",
});

export const insertRole = (role: RoleEdit, onSuccess: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${rolesApi}`,
    method: "POST",
    payload: role,
    onSuccess: onSuccess,
    dispatchPrefix: "ROLES_ROLE_EDIT",
});
