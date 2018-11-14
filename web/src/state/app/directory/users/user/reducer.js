// @flow

import * as types from './actions';
import type { User } from '../types';
import type { Action } from './actions';

export type State = {
    +user: ?User,
    +fetching: boolean,
    +updating: boolean,
    +error: boolean
};

export const defaultState: State = {
    user: null,
    fetching: false,
    updating: false,
    error: false
};

export const reducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'USERS_USER_RECEIVE': {
            return {
                ...state,
                user: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'USERS_USER_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'USERS_USER_FETCHING_ERROR': {
            return {
                ...state,
                user: null,
                fetching: false,
                error: true
            };
        }
        case 'USERS_USER_EDIT_FETCHING': {
            return {
                ...state,
                updating: true
            };
        }
        case 'USERS_USER_EDIT_RECEIVE': {
            return {
                ...state,
                updating: false
            };
        }
        case 'USERS_USER_EDIT_FETCHING_ERROR': {
            return {
                ...state,
                updating: false,
                error: true
            };
        }
        case 'USERS_USER_EDIT_VALIDATION_ERROR': {
            return {
                ...state,
                updating: false
            };
        }
        default:
            return state;
    }
};
