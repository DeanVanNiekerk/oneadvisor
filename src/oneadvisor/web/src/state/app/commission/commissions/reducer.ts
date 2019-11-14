import { combineReducers } from "redux";

import { reducer as commissionReducer, State as CommissionState } from "./commission/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
    commission: CommissionState;
};

export const reducer = combineReducers({
    list: listReducer,
    commission: commissionReducer,
});
