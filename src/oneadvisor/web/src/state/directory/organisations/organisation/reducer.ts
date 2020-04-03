import { OrganisationState } from "../types";
import { OrganisationAction } from "./actions";

export const defaultState: OrganisationState = {
    organisation: null,
    organisationOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (
    state: OrganisationState = defaultState,
    action: OrganisationAction
): OrganisationState => {
    switch (action.type) {
        case "ORGANISATIONS_ORGANISATION_RECEIVE": {
            return {
                ...state,
                organisation: action.payload,
                organisationOriginal: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "ORGANISATIONS_ORGANISATION_MODIFIED": {
            return {
                ...state,
                organisation: action.payload,
            };
        }
        case "ORGANISATIONS_ORGANISATION_FETCHING": {
            return {
                ...state,
                organisation: null,
                organisationOriginal: null,
                validationResults: [],
                fetching: true,
            };
        }
        case "ORGANISATIONS_ORGANISATION_FETCHING_ERROR": {
            return {
                ...state,
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
        case "ORGANISATIONS_ORGANISATION_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
