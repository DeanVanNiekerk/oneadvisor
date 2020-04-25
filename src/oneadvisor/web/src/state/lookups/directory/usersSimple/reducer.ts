import { combineReducers } from "redux";

import { UsersSimpleState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as userSimpleReducer } from "./userSimple/reducer";

export const reducer = combineReducers<UsersSimpleState>({
    list: listReducer,
    userSimple: userSimpleReducer,
});
