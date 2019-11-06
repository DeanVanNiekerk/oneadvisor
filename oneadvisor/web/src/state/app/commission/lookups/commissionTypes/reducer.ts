import { combineReducers } from "redux";

import { reducer as commissionTypeReducer, State as CommissionTypeState } from "./commissionType/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
    commissionType: CommissionTypeState;
};

export const reducer = combineReducers({
    list: listReducer,
    commissionType: commissionTypeReducer,
});
