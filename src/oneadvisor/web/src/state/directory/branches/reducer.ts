import { combineReducers } from "redux";

import { reducer as branchReducer } from "./branch/reducer";
import { reducer as listReducer } from "./list/reducer";
import { BranchesState } from "./types";

export const reducer = combineReducers<BranchesState>({
    list: listReducer,
    branch: branchReducer,
});
