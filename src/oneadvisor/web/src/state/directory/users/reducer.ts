import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { UsersState } from "./types";
import { reducer as userReducer } from "./user/reducer";

export const reducer = combineReducers<UsersState>({
    list: listReducer,
    user: userReducer,
});
