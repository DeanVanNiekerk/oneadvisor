// @flow

import * as types from './actions';
import type { User } from '../types';
import type { Action } from './actions';

export type State = {
    +user: ?User,
    +fetching: boolean,
    +error: boolean
};

export const defaultState: State = {
    user: null,
    fetching: false,
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
        default:
            return state;
    }
};
