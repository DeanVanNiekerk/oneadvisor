import { ValidationResult } from '@/state/types';

import { MemberEdit } from '../types';
import { Action } from './actions';

export type State = {
    readonly member: MemberEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly error: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    member: null,
    fetching: false,
    updating: false,
    error: false,
    validationResults: []
};

export const reducer = (state: State = defaultState, action: Action): State => {
    switch (action.type) {
        case 'MEMBERS_MEMBER_RECEIVE': {
            return {
                ...state,
                member: action.payload,
                fetching: false,
                error: false,
                validationResults: []
            };
        }
        case 'MEMBERS_MEMBER_FETCHING': {
            return {
                ...state,
                fetching: true,
                member: null,
                validationResults: []
            };
        }
        case 'MEMBERS_MEMBER_FETCHING_ERROR': {
            return {
                ...state,
                member: null,
                fetching: false,
                error: true
            };
        }
        case 'MEMBERS_MEMBER_EDIT_FETCHING': {
            return {
                ...state,
                updating: true,
                validationResults: []
            };
        }
        case 'MEMBERS_MEMBER_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'MEMBERS_MEMBER_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'MEMBERS_MEMBER_EDIT_VALIDATION_ERROR': {
            return {
                ...state,
                updating: false,
                validationResults: action.payload
            };
        }
        default:
            return state;
    }
};
