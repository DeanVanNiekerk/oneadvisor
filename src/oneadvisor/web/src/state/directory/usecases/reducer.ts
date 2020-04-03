import { combineReducers } from "redux";

import { UseCasesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<UseCasesState>({
    list: listReducer,
});
