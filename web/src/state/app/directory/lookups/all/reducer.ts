import { LookupsAction } from './actions';

export type State = {
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: LookupsAction
): State => {
    switch (action.type) {
        case 'LOOKUPS_RECEIVE': {
            return {
                ...state,
                fetching: false
            };
        }
        case 'LOOKUPS_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'LOOKUPS_FETCHING_ERROR': {
            return {
                ...state,
                fetching: false,
                error: true
            };
        }
        default:
            return state;
    }
};
