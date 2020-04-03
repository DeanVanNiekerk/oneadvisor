import update from "immutability-helper";

import { ImportClientAction } from "./actions";
import { ImportState } from "./types";

export const defaultState: ImportState = {
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
        "policyCompanyId",
        "policyUserFullName",
        "policyPremium",
        "policyTypeCode",
        "policyStartDate",
        "clientTypeCode",
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
            id: "policyCompanyId",
            name: "Policy Company Id",
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
            id: "policyTypeCode",
            name: "Policy Type Code",
        },
        {
            id: "policyStartDate",
            name: "Policy Start Date",
        },
        {
            id: "clientTypeCode",
            name: "Client Type Code",
        },
    ],
};

export const reducer = (
    state: ImportState = defaultState,
    action: ImportClientAction
): ImportState => {
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
            const index = clients.findIndex((m) => m._id === action.payload);

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
                clients: state.clients.map((client) => {
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
