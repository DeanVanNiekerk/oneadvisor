import { Identity } from '../types';
import { IdentityAction } from './actions';

export type State = {
    readonly identity: Identity | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    identity: null,
    fetching: false,
    updating: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: IdentityAction
): State => {
    switch (action.type) {
        case 'IDENTITY_RECEIVE': {
            return {
                ...state,
                identity: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'IDENTITY_FETCHING': {
            return {
                ...state,
                fetching: true,
                identity: null
            };
        }
        case 'IDENTITY_FETCHING_ERROR': {
            return {
                ...state,
                identity: null,
                fetching: false,
                error: true
            };
        }
        default:
            return state;
    }
};
