import { combineReducers } from "redux";

import { TemplatesState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as templateReducer } from "./template/reducer";

export const reducer = combineReducers<TemplatesState>({
    list: listReducer,
    template: templateReducer,
});
