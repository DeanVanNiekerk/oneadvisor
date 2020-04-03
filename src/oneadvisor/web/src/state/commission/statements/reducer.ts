import { combineReducers } from "redux";

import { StatementsState } from "./";
import { reducer as filesReducer } from "./files/reducer";
import { reducer as listReducer } from "./list/reducer";
import { reducer as previewReducer } from "./preview/reducer";
import { reducer as statementReducer } from "./statement/reducer";

export const reducer = combineReducers<StatementsState>({
    list: listReducer,
    statement: statementReducer,
    preview: previewReducer,
    files: filesReducer,
});
