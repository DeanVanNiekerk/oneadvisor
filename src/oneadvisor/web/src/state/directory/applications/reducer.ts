import { combineReducers } from "redux";

import { ApplicationsState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<ApplicationsState>({
    list: listReducer,
});
