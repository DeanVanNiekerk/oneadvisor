import { ValidationResult } from "@/app/validation";

import { Role } from "../types";
import { RoleAction } from "./actions";

export type State = {
    readonly role: Role | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    role: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: RoleAction): State => {
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
