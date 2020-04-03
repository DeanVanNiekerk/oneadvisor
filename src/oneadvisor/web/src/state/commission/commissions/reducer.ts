import { combineReducers } from "redux";

import { CommissionsState } from "./";
import { reducer as commissionReducer } from "./commission/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<CommissionsState>({
    list: listReducer,
    commission: commissionReducer,
});
