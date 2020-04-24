import { combineReducers } from "redux";

import { ClientTypesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<ClientTypesState>({
    list: listReducer,
});
