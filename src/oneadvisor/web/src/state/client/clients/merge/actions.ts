import { Dispatch } from "redux";

import { appendFiltersQuery } from "@/app/query";
import { Filters, PagedItems } from "@/app/table";
import { ApiAction, ApiOnSuccess, Result } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { clientsApi, mergeClientsApi } from "@/config/api/client";

import { Client, ClientEdit, MergeClients, receiveClientValidationResults } from "../";

type ClientMergeSourceReceiveAction = {
    type: "CLIENTS_MERGE_SOURCE_RECEIVE";
    payload: PagedItems<Client>;
};
type ClientMergeSourceFetchingAction = {
    type: "CLIENTS_MERGE_SOURCE_FETCHING";
};
type ClientMergeSourceFetchingErrorAction = {
    type: "CLIENTS_MERGE_SOURCE_FETCHING_ERROR";
};

type ClientMergeNextStepReceiveAction = {
    type: "CLIENTS_MERGE_NEXT_STEP";
};

type ClientMergePreviousStepReceiveAction = {
    type: "CLIENTS_MERGE_PREVIOUS_STEP";
};

type ClientMergeResetAction = {
    type: "CLIENTS_MERGE_RESET";
};

type ClientMergeReceiveAction = {
    type: "CLIENTS_MERGE_RECEIVE";
    payload: Result<ClientEdit>;
};
type ClientMergeFetchingAction = {
    type: "CLIENTS_MERGE_FETCHING";
};
type ClientMergeFetchingErrorAction = {
    type: "CLIENTS_MERGE_FETCHING_ERROR";
};
type ClientMergeValidationErrorAction = {
    type: "CLIENTS_MERGE_VALIDATION_ERROR";
};

export type ClientMergeAction =
    | ClientMergeReceiveAction
    | ClientMergeFetchingAction
    | ClientMergeFetchingErrorAction
    | ClientMergeValidationErrorAction
    | ClientMergeSourceReceiveAction
    | ClientMergeSourceFetchingAction
    | ClientMergeSourceFetchingErrorAction
    | ClientMergeNextStepReceiveAction
    | ClientMergePreviousStepReceiveAction
    | ClientMergeResetAction;

export const fetchMergeClients = (clientIds: string[]): ApiAction => {
    let api = clientsApi;
    const filters: Filters = {
        clientId: clientIds,
    };
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "CLIENTS_MERGE_SOURCE",
    };
};

export const clientMergeNextStep = (): ClientMergeAction => ({
    type: "CLIENTS_MERGE_NEXT_STEP",
});

export const clientMergePreviousStep = (): ClientMergeAction => ({
    type: "CLIENTS_MERGE_PREVIOUS_STEP",
});

export const clientMergeReset = (): ClientMergeAction => ({
    type: "CLIENTS_MERGE_RESET",
});

export const mergeClients = (merge: MergeClients, onSuccess: ApiOnSuccess): ApiAction => {
    return {
        type: "API",
        method: "POST",
        endpoint: mergeClientsApi,
        payload: merge,
        dispatchPrefix: "CLIENTS_MERGE",
        onSuccess: onSuccess,
        onValidationFailure: (validationResults: ValidationResult[], dispatch: Dispatch) => {
            dispatch(receiveClientValidationResults(validationResults));
        },
    };
};
