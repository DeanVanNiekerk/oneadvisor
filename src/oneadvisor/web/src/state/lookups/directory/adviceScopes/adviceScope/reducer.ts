import { AdviceScopeState } from "../types";
import { AdviceScopeAction } from "./actions";

export const defaultState: AdviceScopeState = {
    adviceScope: null,
    adviceScopeOriginal: null,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (
    state: AdviceScopeState = defaultState,
    action: AdviceScopeAction
): AdviceScopeState => {
    switch (action.type) {
        case "ADVICESCOPES_ADVICESCOPE_RECEIVE": {
            return {
                ...state,
                adviceScope: action.payload,
                adviceScopeOriginal: action.payload,
                validationResults: [],
            };
        }
        case "ADVICESCOPES_ADVICESCOPE_MODIFIED": {
            return {
                ...state,
                adviceScope: action.payload,
            };
        }
        case "ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "ADVICESCOPES_ADVICESCOPE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ADVICESCOPES_ADVICESCOPE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ADVICESCOPES_ADVICESCOPE_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "ADVICESCOPES_ADVICESCOPE_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
