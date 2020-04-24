import { AdviceServiceListState } from "../types";
import { AdviceServiceListAction } from "./actions";

export const defaultState: AdviceServiceListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: AdviceServiceListState = defaultState,
    action: AdviceServiceListAction
): AdviceServiceListState => {
    switch (action.type) {
        case "ADVICESERVICES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "ADVICESERVICES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ADVICESERVICES_LIST_FETCHING_ERROR": {
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
