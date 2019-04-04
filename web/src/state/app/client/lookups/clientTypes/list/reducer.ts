import { ClientType } from '../types';
import { ClientTypeListAction } from './actions';

export type State = {
    readonly items: ClientType[];
};

export const defaultState: State = {
    items: [],
};

export const reducer = (
    state: State = defaultState,
    action: ClientTypeListAction
): State => {
    switch (action.type) {
        case "CLIENTTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
