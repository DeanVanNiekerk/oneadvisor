import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { ClientTypesState } from "./types";

export const reducer = combineReducers<ClientTypesState>({
    list: listReducer,
});
