import { combineReducers } from "redux";

import { BranchesSimpleState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<BranchesSimpleState>({
    list: listReducer,
});
