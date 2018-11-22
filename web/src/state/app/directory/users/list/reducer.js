// @flow
import type { PageOptions } from '@/state/types';
import { defaultPageOptions } from '@/config/defaults';

import * as types from './actions';
import type { User } from '../types';
import type { Action } from './actions';

export type State = {
    +totalItems: number,
    +items: User[],
    +fetching: boolean,
    +error: boolean,
    +pageOptions: PageOptions
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
    error: false,
    pageOptions: defaultPageOptions()
};

export const reducer = (state: State = defaultState, action: Action): State => {
    switch (action.type) {
        case 'USERS_LIST_RECEIVE': {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'USERS_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'USERS_LIST_FETCHING_ERROR': {
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
