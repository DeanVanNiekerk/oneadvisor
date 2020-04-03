import { combineReducers } from "redux";

import { reducer as commission, State as CommissionState } from "./commission/reducer";

export type State = {
    commission: CommissionState;
};

export const reducer = combineReducers({
    commission: commission,
});
