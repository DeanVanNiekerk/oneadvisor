import { Contact } from "../types";
import { ContactListAction } from "./actions";

export type State = {
    readonly totalItems: number;
    readonly items: Contact[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
};

export const reducer = (
    state: State = defaultState,
    action: ContactListAction
): State => {
    switch (action.type) {
        case "CONTACTS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "CONTACTS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CONTACTS_LIST_FETCHING_ERROR": {
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
