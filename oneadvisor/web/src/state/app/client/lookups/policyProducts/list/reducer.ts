import { PolicyProduct } from '../types';
import { PolicyProductListAction } from './actions';

export type State = {
    readonly items: PolicyProduct[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: State = defaultState,
    action: PolicyProductListAction
): State => {
    switch (action.type) {
        case "POLICYPRODUCTS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "POLICYPRODUCTS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "POLICYPRODUCTS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        default:
            return state;
    }
};
