import { combineReducers } from "redux";

import { CommissionEarningsTypesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<CommissionEarningsTypesState>({
    list: listReducer,
});
