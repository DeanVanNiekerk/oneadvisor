import { ListState } from "../types";
import { AllocationListAction } from "./actions";

export const defaultState: ListState = {
    totalItems: 0,
    items: [],
    fetching: false,
};

export const reducer = (
    state: ListState = defaultState,
    action: AllocationListAction
): ListState => {
    switch (action.type) {
        case "ALLOCATIONS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "ALLOCATIONS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ALLOCATIONS_LIST_FETCHING_ERROR": {
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
