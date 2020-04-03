import { ListState } from "../types";
import { UseCaseListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    fetching: false,
};

export const reducer = (state: ListState = defaultState, action: UseCaseListAction): ListState => {
    switch (action.type) {
        case "USECASES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "USECASES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "USECASES_LIST_FETCHING_ERROR": {
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
