import { defaultPageOptions } from '@/config/defaults';
import { PageOptions } from '@/state/types';

import { Member } from '../types';
import { Action } from './actions';

export type State = {
    readonly totalItems: number;
    readonly items: Member[];
    readonly fetching: boolean;
    readonly error: boolean;
    readonly pageOptions: PageOptions;
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
        case 'MEMBERS_LIST_RECEIVE': {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'MEMBERS_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'MEMBERS_LIST_FETCHING_ERROR': {
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
