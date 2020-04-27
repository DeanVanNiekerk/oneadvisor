import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { PolicyTypesState } from "./types";

export const reducer = combineReducers<PolicyTypesState>({
    list: listReducer,
});
