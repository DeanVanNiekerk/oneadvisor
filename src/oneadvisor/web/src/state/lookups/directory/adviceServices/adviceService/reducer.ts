import { AdviceServiceState } from "../types";
import { AdviceServiceAction } from "./actions";

export const defaultState: AdviceServiceState = {
    adviceService: null,
    adviceServiceOriginal: null,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (
    state: AdviceServiceState = defaultState,
    action: AdviceServiceAction
): AdviceServiceState => {
    switch (action.type) {
        case "ADVICESERVICES_ADVICESERVICE_RECEIVE": {
            return {
                ...state,
                adviceService: action.payload,
                adviceServiceOriginal: action.payload,
                validationResults: [],
            };
        }
        case "ADVICESERVICES_ADVICESERVICE_MODIFIED": {
            return {
                ...state,
                adviceService: action.payload,
            };
        }
        case "ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "ADVICESERVICES_ADVICESERVICE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ADVICESERVICES_ADVICESERVICE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ADVICESERVICES_ADVICESERVICE_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "ADVICESERVICES_ADVICESERVICE_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
