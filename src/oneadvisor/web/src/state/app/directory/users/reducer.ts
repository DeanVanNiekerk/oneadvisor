import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as userReducer, State as UserState } from "./user/reducer";

export type State = {
    list: ListState;
    user: UserState;
};

export const reducer = combineReducers({
    list: listReducer,
    user: userReducer,
});
