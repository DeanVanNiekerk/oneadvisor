import { MappingState } from "../";
import { CommissionMappingErrorAction } from "./actions";

export const defaultState: MappingState = {
    commissionError: null,
    commissionErrorOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (
    state: MappingState = defaultState,
    action: CommissionMappingErrorAction
): MappingState => {
    switch (action.type) {
        case "COMMISSIONS_ERROR_MAPPING_RECEIVE": {
            return {
                ...state,
                commissionError: action.payload,
                commissionErrorOriginal: action.payload,
                fetching: false,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_MODIFIED": {
            return {
                ...state,
                commissionError: action.payload,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_FETCHING": {
            return {
                ...state,
                fetching: true,
                commissionError: null,
                commissionErrorOriginal: null,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_FETCHING_ERROR": {
            return {
                ...state,
                commissionError: null,
                commissionErrorOriginal: null,
                fetching: false,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "COMMISSIONS_ERROR_MAPPING_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
