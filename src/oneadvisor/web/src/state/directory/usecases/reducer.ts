import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { UseCasesState } from "./types";

export const reducer = combineReducers<UseCasesState>({
    list: listReducer,
});
