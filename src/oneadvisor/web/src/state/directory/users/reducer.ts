import { combineReducers } from "redux";

import { UsersState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as userReducer } from "./user/reducer";

export const reducer = combineReducers<UsersState>({
    list: listReducer,
    user: userReducer,
});
