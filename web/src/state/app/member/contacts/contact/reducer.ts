import { ValidationResult } from '@/app/validation';

import { Contact } from '../types';
import { ContactAction } from './actions';

export type State = {
    readonly contact: Contact | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    contact: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: State = defaultState,
    action: ContactAction
): State => {
    switch (action.type) {
        case "CONTACTS_CONTACT_RECEIVE": {
            return {
                ...state,
                contact: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "CONTACTS_CONTACT_FETCHING": {
            return {
                ...state,
                validationResults: [],
                fetching: true,
            };
        }
        case "CONTACTS_CONTACT_FETCHING_ERROR": {
            return {
                ...state,
                contact: null,
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
        default:
            return state;
    }
};
