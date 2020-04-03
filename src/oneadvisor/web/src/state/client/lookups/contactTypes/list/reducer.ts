import { ContactTypesListState } from "../types";
import { ContactTypeListAction } from "./actions";

export const defaultState: ContactTypesListState = {
    items: [],
};

export const reducer = (
    state: ContactTypesListState = defaultState,
    action: ContactTypeListAction
): ContactTypesListState => {
    switch (action.type) {
        case "CONTACTTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
