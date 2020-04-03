import { combineReducers } from "redux";

import { AllocationsState } from "./";
import { reducer as allocationReducer } from "./allocation/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<AllocationsState>({
    list: listReducer,
    allocation: allocationReducer,
});
