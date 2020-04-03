import { combineReducers } from "redux";

import { UserTypesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<UserTypesState>({
    list: listReducer,
});
