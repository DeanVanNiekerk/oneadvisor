import { RoleState } from "../types";
import { RoleAction } from "./actions";

export const defaultState: RoleState = {
    role: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: RoleState = defaultState, action: RoleAction): RoleState => {
    switch (action.type) {
        case "ROLES_ROLE_RECEIVE": {
            return {
                ...state,
                role: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "ROLES_ROLE_FETCHING": {
            return {
                ...state,
                role: null,
                validationResults: [],
                fetching: true,
            };
        }
        case "ROLES_ROLE_FETCHING_ERROR": {
            return {
                ...state,
                role: null,
                fetching: false,
            };
        }
        case "ROLES_ROLE_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "ROLES_ROLE_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ROLES_ROLE_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ROLES_ROLE_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        default:
            return state;
    }
};
