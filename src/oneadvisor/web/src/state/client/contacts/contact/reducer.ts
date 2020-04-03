import { ContactState } from "../types";
import { ContactAction } from "./actions";

export const defaultState: ContactState = {
    contact: null,
    contactOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (
    state: ContactState = defaultState,
    action: ContactAction
): ContactState => {
    switch (action.type) {
        case "CONTACTS_CONTACT_RECEIVE": {
            return {
                ...state,
                contact: action.payload,
                contactOriginal: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "CONTACTS_CONTACT_MODIFIED": {
            return {
                ...state,
                contact: action.payload,
            };
        }
        case "CONTACTS_CONTACT_FETCHING": {
            return {
                ...state,
                validationResults: [],
                contact: null,
                contactOriginal: null,
                fetching: true,
            };
        }
        case "CONTACTS_CONTACT_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "CONTACTS_CONTACT_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "CONTACTS_CONTACT_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CONTACTS_CONTACT_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CONTACTS_CONTACT_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "CONTACTS_CONTACT_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};
