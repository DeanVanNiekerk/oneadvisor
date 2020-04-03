import { CommissionTypeListState } from "../types";
import { CommissionTypeListAction } from "./actions";

export const defaultState: CommissionTypeListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: CommissionTypeListState = defaultState,
    action: CommissionTypeListAction
): CommissionTypeListState => {
    switch (action.type) {
        case "COMMISSIONTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "COMMISSIONTYPES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONTYPES_LIST_FETCHING_ERROR": {
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
