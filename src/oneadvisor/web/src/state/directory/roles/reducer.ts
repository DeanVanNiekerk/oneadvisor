import { combineReducers } from "redux";

import { RolesState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as roleReducer } from "./role/reducer";

export const reducer = combineReducers<RolesState>({
    list: listReducer,
    role: roleReducer,
});
