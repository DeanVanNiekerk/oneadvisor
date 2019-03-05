import { Member } from '../types';
import { MemberSearchAction } from './actions';

export type State = {
    readonly items: Member[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: State = defaultState,
    action: MemberSearchAction
): State => {
    switch (action.type) {
        case "MEMBERS_SEARCH_RECEIVE": {
            return {
                ...state,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "MEMBERS_SEARCH_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "MEMBERS_SEARCH_FETCHING_ERROR": {
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
