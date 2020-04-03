import { combineReducers } from "redux";

import { PolicyTypesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<PolicyTypesState>({
    list: listReducer,
});
