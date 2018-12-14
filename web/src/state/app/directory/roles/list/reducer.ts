import { Role } from '../types';
import { RoleListAction } from './actions';

export type State = {
    readonly items: Role[];
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
    action: RoleListAction
): State => {
    switch (action.type) {
        case 'ROLES_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'ROLES_LIST_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'ROLES_LIST_FETCHING_ERROR': {
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
