import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { clientsApi } from "@/config/api/client";
import { RootState } from "@/state/rootReducer";

import { clientIsModifiedSelector, clientSelector, createClient } from "../";
import { ClientEdit } from "../types";

type ClientReceiveAction = {
    type: "CLIENTS_CLIENT_RECEIVE";
    payload: ClientEdit | null;
};
type ClientModifiedAction = {
    type: "CLIENTS_CLIENT_MODIFIED";
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
    | ClientModifiedAction
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

export const modifyClient = (client: ClientEdit): ClientModifiedAction => ({
    type: 'CLIENTS_CLIENT_MODIFIED',
    payload: client
});

export const clearClient = (): ClientReceiveAction => receiveClient(null);

export const newClient = (): ClientReceiveAction => receiveClient(createClient());

export const saveClient = (onSaved?: () => void): ThunkAction<void, RootState, {}, ClientReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { client } = clientSelector(getState());
        if (!client) return;

        const onSuccess = () => {
            dispatch(clearClient());
            if (onSaved) onSaved();
        }

        if (client.id) {
            dispatch(updateClient(client, onSuccess));
        } else {
            dispatch(insertClient(client, onSuccess));
        }
    };
}

export const confirmCancelClient = (showConfirm: ShowConfirm): ThunkAction<void, RootState, {}, ClientReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = clientIsModifiedSelector(getState());

        const close = () => dispatch(clearClient());

        if (modifed)
            return showConfirm({ onOk: () => { close(); } });

        close();
    };
}

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
