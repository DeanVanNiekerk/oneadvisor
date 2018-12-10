import { PageOptions } from '@/state/types';

import { Organisation } from '../types';
import { Action } from './actions';


export type State = {
    readonly totalItems: number,
    readonly items: Organisation[],
    readonly fetching: boolean,
    readonly error: boolean,
    readonly pageOptions: PageOptions
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
    error: false,
    pageOptions: { number: 0, size: 0 }
};

export const reducer = (state: State = defaultState, action: Action): State => {
    switch (action.type) {
        case 'ORGANISATIONS_LIST_RECEIVE': {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
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
        case 'ORGANISATIONS_LIST_PAGE_NUMBER_RECEIVE': {
            return {
                ...state,
                pageOptions: {
                    ...state.pageOptions,
                    number: action.payload
                }
            };
        }
        default:
            return state;
    }
};
