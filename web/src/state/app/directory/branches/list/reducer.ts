import { Branch } from '../types';
import { BranchListAction } from './actions';

export type State = {
    readonly items: Branch[];
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: BranchListAction
): State => {
    switch (action.type) {
        case 'BRANCHES_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
                error: false
            };
        }
        case 'BRANCHES_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'BRANCHES_LIST_FETCHING_ERROR': {
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
