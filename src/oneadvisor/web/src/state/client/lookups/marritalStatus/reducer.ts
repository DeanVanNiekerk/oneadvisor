import { combineReducers } from "redux";

import { MarritalStatusState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<MarritalStatusState>({
    list: listReducer,
});
