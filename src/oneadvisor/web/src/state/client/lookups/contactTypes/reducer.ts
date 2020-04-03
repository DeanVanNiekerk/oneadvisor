import { combineReducers } from "redux";

import { ContactTypesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<ContactTypesState>({
    list: listReducer,
});
