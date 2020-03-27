import { AnyAction, Dispatch } from "redux";
import { v4 } from "uuid";

import { clientsImportApi } from "@/config/api/client";

import { ImportClient, ImportColumn, ImportData, ResultFailure } from "./";

type ImportFileNameReceiveAction = {
    type: "CLIENTS_IMPORT_FILE_NAME_RECEIVE";
    payload: string;
};

type ImportDataReceiveAction = {
    type: "CLIENTS_IMPORT_DATA_RECEIVE";
    payload: ImportData;
};

type ImportColumnsReceiveAction = {
    type: "CLIENTS_IMPORT_COLUMNS_RECEIVE";
    payload: ImportColumn[];
};

type ImportClientsReceiveAction = {
    type: "CLIENTS_IMPORT_CLIENTS_RECEIVE";
    payload: ImportClient[];
};

type ImportClientsRemoveAction = {
    type: "CLIENTS_IMPORT_CLIENTS_REMOVE";
    payload: string;
};

type ImportClientsPolicyCompanyReceiveAction = {
    type: "CLIENTS_IMPORT_CLIENTS_POLICY_COMPANY_RECEIVE";
    payload: string;
};

type ImportClientsUpdatePolicyCompaniesAction = {
    type: "CLIENTS_IMPORT_CLIENTS_UPDATE_POLICY_COMPANIES";
};

type ImportNextStepReceiveAction = {
    type: "CLIENTS_IMPORT_CLIENTS_NEXT_STEP";
};

type ImportPreviousStepReceiveAction = {
    type: "CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP";
};

type ImportClientImportClearResultsAction = {
    type: "CLIENTS_IMPORT_CLIENT_CLEAR_RESULTS";
};

type ImportClientImportSuccessAction = {
    type: "CLIENTS_IMPORT_CLIENT_SUCCESS";
    payload: ImportClient;
};
type ImportClientImportFailureAction = {
    type: "CLIENTS_IMPORT_CLIENT_FAILURE";
    payload: ResultFailure;
};

type ImportClientImportResetAction = {
    type: "CLIENTS_IMPORT_CLIENT_RESET";
};

type ImportClientsSelectedColumnsReceiveAction = {
    type: "CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE";
    payload: (keyof ImportClient)[];
};

export type ImportClientAction =
    | ImportFileNameReceiveAction
    | ImportDataReceiveAction
    | ImportColumnsReceiveAction
    | ImportClientsReceiveAction
    | ImportClientsRemoveAction
    | ImportClientsPolicyCompanyReceiveAction
    | ImportNextStepReceiveAction
    | ImportPreviousStepReceiveAction
    | ImportClientImportSuccessAction
    | ImportClientImportFailureAction
    | ImportClientImportClearResultsAction
    | ImportClientsUpdatePolicyCompaniesAction
    | ImportClientImportResetAction
    | ImportClientsSelectedColumnsReceiveAction;

export const receiveClientImportFileName = (fileName: string): ImportClientAction => ({
    type: "CLIENTS_IMPORT_FILE_NAME_RECEIVE",
    payload: fileName,
});

export const receiveClientImportData = (data: ImportData): ImportClientAction => ({
    type: "CLIENTS_IMPORT_DATA_RECEIVE",
    payload: data,
});

export const receiveClientImportColumns = (columns: ImportColumn[]): ImportClientAction => ({
    type: "CLIENTS_IMPORT_COLUMNS_RECEIVE",
    payload: columns,
});

export const receiveClientImportSelectedColumns = (
    columns: (keyof ImportClient)[]
): ImportClientAction => ({
    type: "CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE",
    payload: columns,
});

export const receiveClientImportClients = (data: ImportClient[]): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENTS_RECEIVE",
    payload: data,
});

export const removeClientImportClient = (id: string): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENTS_REMOVE",
    payload: id,
});

export const receiveClientImportPolicyCompany = (companyId: string): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENTS_POLICY_COMPANY_RECEIVE",
    payload: companyId,
});

export const updateClientImportPolicyCompanies = (): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENTS_UPDATE_POLICY_COMPANIES",
});

export const clientImportNextStep = (): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENTS_NEXT_STEP",
});

export const clientImportPreviousStep = (): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP",
});

export const importClientClearResults = (): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENT_CLEAR_RESULTS",
});

export const importClientReset = (): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENT_RESET",
});

export const importClientSuccess = (importClient: ImportClient): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENT_SUCCESS",
    payload: importClient,
});

export const importClientFailure = (
    importClient: ImportClient,
    error: string
): ImportClientAction => ({
    type: "CLIENTS_IMPORT_CLIENT_FAILURE",
    payload: {
        _id: v4(),
        importClient: importClient,
        error: error,
    },
});

export type QueueMiddleware = {
    type: string;
    queue: string;
    callback: (next: () => void, dispatch: Dispatch<AnyAction>) => void;
};

export const importClient = (client: ImportClient): QueueMiddleware => {
    return {
        type: "QUEUE",
        queue: "CLIENTS_IMPORT_CLIENTS",
        callback: (next, dispatch) => {
            dispatch({
                type: "API",
                endpoint: `${clientsImportApi}`,
                method: "POST",
                payload: client,
                hideNotifications: true,
                onSuccess: () => {
                    dispatch(importClientSuccess(client));
                    next();
                },
                onFailure: (error) => {
                    dispatch(importClientFailure(client, JSON.stringify(error, null, 4)));
                    next();
                },
            });
        },
    };
};
