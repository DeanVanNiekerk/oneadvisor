import { UseCase } from '../types';
import { Action } from './actions';

export type State = {
    readonly items: UseCase[];
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
    error: false
};

export const reducer = (state: State = defaultState, action: Action): State => {
    switch (action.type) {
        case 'USECASES_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'USECASES_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'USECASES_LIST_FETCHING_ERROR': {
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
