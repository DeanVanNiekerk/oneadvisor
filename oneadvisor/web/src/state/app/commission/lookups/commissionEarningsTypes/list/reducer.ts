import { CommissionEarningsType } from "../types";
import { CommissionEarningsTypeListAction } from "./actions";

export type State = {
    readonly items: CommissionEarningsType[];
};

export const defaultState: State = {
    items: [],
};

export const reducer = (state: State = defaultState, action: CommissionEarningsTypeListAction): State => {
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
