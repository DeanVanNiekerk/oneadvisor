import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { reducer as roleReducer } from "./role/reducer";
import { RolesState } from "./types";

export const reducer = combineReducers<RolesState>({
    list: listReducer,
    role: roleReducer,
});
