import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer,
});
