import { combineReducers } from "redux";

import { reducer as contactReducer, State as ContactState } from "./contact/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
    contact: ContactState;
};

export const reducer = combineReducers({
    list: listReducer,
    contact: contactReducer,
});
