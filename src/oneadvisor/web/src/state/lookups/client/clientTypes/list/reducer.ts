import { ClientTypeListState } from "../types";
import { ClientTypeListAction } from "./actions";

export const defaultState: ClientTypeListState = {
    items: [],
};

export const reducer = (
    state: ClientTypeListState = defaultState,
    action: ClientTypeListAction
): ClientTypeListState => {
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
