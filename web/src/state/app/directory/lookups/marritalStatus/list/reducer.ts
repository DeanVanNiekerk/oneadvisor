import { MarritalStatus } from '../types';
import { MarritalStatusListAction } from './actions';

export type State = {
    readonly items: MarritalStatus[];
};

export const defaultState: State = {
    items: []
};

export const reducer = (
    state: State = defaultState,
    action: MarritalStatusListAction
): State => {
    switch (action.type) {
        case 'MARRITALSTATUS_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload
            };
        }
        default:
            return state;
    }
};
