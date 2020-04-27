import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { MarritalStatusState } from "./types";

export const reducer = combineReducers<MarritalStatusState>({
    list: listReducer,
});
