// @flow

import * as types from './actions';
import type { Organisation } from '../types';
import type { Action } from './actions';

export type State = {
    +items: Organisation[],
    +fetching: boolean,
    +error: boolean
};

export const defaultState: State = {
    items: [],
    fetching: false,
    error: false
};

export const reducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'ORGANISATIONS_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'ORGANISATIONS_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'ORGANISATIONS_LIST_FETCHING_ERROR': {
            return {
                ...state,
                items: [],
                fetching: false,
                error: true
            };
        }
        default:
            return state;
    }
};
