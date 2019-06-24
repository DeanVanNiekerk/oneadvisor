import { Role } from '../types';
import { RoleListAction } from './actions';

export type State = {
    readonly items: Role[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: State = defaultState,
    action: RoleListAction
): State => {
    switch (action.type) {
        case "ROLES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "ROLES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ROLES_LIST_FETCHING_ERROR": {
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
