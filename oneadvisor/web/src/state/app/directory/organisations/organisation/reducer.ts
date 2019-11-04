import { ValidationResult } from "@/app/validation";

import { OrganisationEdit } from "../types";
import { OrganisationAction } from "./actions";

export type State = {
    readonly organisation: OrganisationEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    organisation: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: OrganisationAction): State => {
    switch (action.type) {
        case "ORGANISATIONS_ORGANISATION_RECEIVE": {
            return {
                ...state,
                organisation: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "ORGANISATIONS_ORGANISATION_FETCHING": {
            return {
                ...state,
                validationResults: [],
                fetching: true,
            };
        }
        case "ORGANISATIONS_ORGANISATION_FETCHING_ERROR": {
            return {
                ...state,
                organisation: null,
                fetching: false,
            };
        }
        case "ORGANISATIONS_ORGANISATION_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "ORGANISATIONS_ORGANISATION_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ORGANISATIONS_ORGANISATION_EDIT_VALIDATION_ERROR": {
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
