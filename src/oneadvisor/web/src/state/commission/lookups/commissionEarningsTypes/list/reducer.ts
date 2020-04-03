import { CommissionEarningsTypeListState } from "../types";
import { CommissionEarningsTypeListAction } from "./actions";

export const defaultState: CommissionEarningsTypeListState = {
    items: [],
};

export const reducer = (
    state: CommissionEarningsTypeListState = defaultState,
    action: CommissionEarningsTypeListAction
): CommissionEarningsTypeListState => {
    switch (action.type) {
        case "COMMISSIONEARNINGSTYPE_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
