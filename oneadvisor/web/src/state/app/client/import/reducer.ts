import update from 'immutability-helper';

import { ImportClientAction } from './actions';
import { ImportClient, ImportColumn, ImportData, ResultFailure } from './types';

export type State = {
    readonly fileName: string;
    readonly data: ImportData;
    readonly currentStepIndex: number;
    readonly steps: string[];
    readonly columns: ImportColumn[];
    readonly selectedColumns: string[];
    readonly clients: ImportClient[];
    readonly companyId: string | null;
    readonly resultsSuccess: ImportClient[];
    readonly resultsFailure: ResultFailure[];
};

export const defaultState: State = {
    fileName: "",
    data: [],
    clients: [],
    resultsSuccess: [],
    resultsFailure: [],
    companyId: null,
    currentStepIndex: 0,
    steps: ["Select File", "Configure", "Verify", "Import"],
    selectedColumns: [
        "idNumber",
        "firstName",
        "lastName",
        "email",
        "cellphone",
        "dateOfBirth",
        "taxNumber",
        "policyNumber",
        "policyUserFullName",
        "policyPremium",
        "policyType",
        "policyStartDate",
    ],
    columns: [
        {
            id: "idNumber",
            name: "ID Number",
        },
        {
            id: "firstName",
            name: "First Name",
        },
        {
            id: "lastName",
            name: "Last Name",
        },
        {
            id: "email",
            name: "Email",
        },
        {
            id: "cellphone",
            name: "Cellphone",
        },
        {
            id: "dateOfBirth",
            name: "Date of Birth",
        },
        {
            id: "taxNumber",
            name: "Tax Number",
        },
        {
            id: "policyNumber",
            name: "Policy Number",
        },
        {
            id: "policyUserFullName",
            name: "Policy Broker",
        },
        {
            id: "policyPremium",
            name: "Policy Premium",
        },
        {
            id: "policyType",
            name: "Policy Type",
        },
        {
            id: "policyStartDate",
            name: "Policy Start Date",
        },
    ],
};

export const reducer = (
    state: State = defaultState,
    action: ImportClientAction
): State => {
    switch (action.type) {
        case "CLIENTS_IMPORT_FILE_NAME_RECEIVE": {
            return {
                ...state,
                fileName: action.payload,
            };
        }
        case "CLIENTS_IMPORT_DATA_RECEIVE": {
            return {
                ...state,
                data: action.payload,
            };
        }
        case "CLIENTS_IMPORT_COLUMNS_RECEIVE": {
            return {
                ...state,
                columns: [...action.payload],
            };
        }
        case "CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE": {
            return {
                ...state,
                selectedColumns: [...action.payload],
            };
        }
        case "CLIENTS_IMPORT_CLIENTS_RECEIVE": {
            return {
                ...state,
                clients: [...action.payload],
            };
        }
        case "CLIENTS_IMPORT_CLIENTS_REMOVE": {
            const clients = state.clients;
            const index = clients.findIndex(m => m._id === action.payload);

            if (index == -1) return state;

            return {
                ...state,
                clients: update(clients, { $splice: [[index, 1]] }),
            };
        }
        case "CLIENTS_IMPORT_CLIENTS_POLICY_COMPANY_RECEIVE": {
            return {
                ...state,
                companyId: action.payload,
            };
        }
        case "CLIENTS_IMPORT_CLIENTS_UPDATE_POLICY_COMPANIES": {
            return {
                ...state,
                clients: state.clients.map(client => {
                    return {
                        ...client,
                        policyCompanyId: state.companyId,
                    };
                }),
            };
        }
        case "CLIENTS_IMPORT_CLIENTS_NEXT_STEP": {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex + 1,
            };
        }
        case "CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP": {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex - 1,
            };
        }
        case "CLIENTS_IMPORT_CLIENT_SUCCESS": {
            return {
                ...state,
                resultsSuccess: update(state.resultsSuccess, {
                    $push: [action.payload],
                }),
            };
        }
        case "CLIENTS_IMPORT_CLIENT_FAILURE": {
            return {
                ...state,
                resultsFailure: update(state.resultsFailure, {
                    $push: [action.payload],
                }),
            };
        }
        case "CLIENTS_IMPORT_CLIENT_CLEAR_RESULTS": {
            return {
                ...state,
                resultsSuccess: [],
                resultsFailure: [],
            };
        }
        case "CLIENTS_IMPORT_CLIENT_RESET": {
            return {
                ...state,
                data: [],
                clients: [],
                resultsSuccess: [],
                resultsFailure: [],
                companyId: null,
                currentStepIndex: 0,
            };
        }
        default:
            return state;
    }
};