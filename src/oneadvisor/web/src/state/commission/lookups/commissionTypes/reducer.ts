import { combineReducers } from "redux";

import { CommissionTypesState } from "./";
import { reducer as commissionTypeReducer } from "./commissionType/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<CommissionTypesState>({
    list: listReducer,
    commissionType: commissionTypeReducer,
});
