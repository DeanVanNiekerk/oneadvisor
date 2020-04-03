import { combineReducers } from "redux";

import { ContactsState } from "./";
import { reducer as contactReducer } from "./contact/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<ContactsState>({
    list: listReducer,
    contact: contactReducer,
});
