import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { ContactTypesState } from "./types";

export const reducer = combineReducers<ContactTypesState>({
    list: listReducer,
});
