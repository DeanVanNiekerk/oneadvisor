import { combineReducers } from "redux";

import { BranchesState } from "./";
import { reducer as branchReducer } from "./branch/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<BranchesState>({
    list: listReducer,
    branch: branchReducer,
});
