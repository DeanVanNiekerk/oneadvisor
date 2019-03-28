import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { clientsApi } from '@/config/api/client';

import { ClientEdit } from '../types';

type ClientReceiveAction = {
    type: "CLIENTS_CLIENT_RECEIVE";
    payload: ClientEdit | null;
};
type ClientFetchingAction = { type: "CLIENTS_CLIENT_FETCHING" };
type ClientFetchingErrorAction = { type: "CLIENTS_CLIENT_FETCHING_ERROR" };

type ClientUpdatedAction = { type: "CLIENTS_CLIENT_EDIT_RECEIVE" };
type ClientUpdatingAction = { type: "CLIENTS_CLIENT_EDIT_FETCHING" };
type ClientUpdatingErrorAction = { type: "CLIENTS_CLIENT_EDIT_FETCHING_ERROR" };
type ClientValidationErrorAction = {
    type: "CLIENTS_CLIENT_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type ClientAction =
    | ClientReceiveAction
    | ClientFetchingAction
    | ClientFetchingErrorAction
    | ClientUpdatedAction
    | ClientUpdatingAction
    | ClientUpdatingErrorAction
    | ClientValidationErrorAction;

export const receiveClient = (
    client: ClientEdit | null
): ClientReceiveAction => ({
    type: "CLIENTS_CLIENT_RECEIVE",
    payload: client,
});

export const getClient = (
    clientId: string,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}/${clientId}`,
    onSuccess: onSuccess,
});

export const fetchClient = (clientId: string): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}/${clientId}`,
    dispatchPrefix: "CLIENTS_CLIENT",
});

export const updateClient = (
    client: ClientEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}/${client.id}`,
    method: "POST",
    payload: client,
    onSuccess: onSuccess,
    dispatchPrefix: "CLIENTS_CLIENT_EDIT",
});

export const insertClient = (
    client: ClientEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}`,
    method: "POST",
    payload: client,
    onSuccess: onSuccess,
    dispatchPrefix: "CLIENTS_CLIENT_EDIT",
});

export const deleteClient = (
    clientId: string,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}/${clientId}`,
    method: "DELETE",
    onSuccess: onSuccess,
    dispatchPrefix: "CLIENTS_CLIENT_EDIT",
});

export const receiveClientValidationResults = (
    validationResults: ValidationResult[]
): ClientAction => ({
    type: "CLIENTS_CLIENT_EDIT_VALIDATION_ERROR",
    payload: validationResults,
});
