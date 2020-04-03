import { combineReducers } from "redux";

import { LogsState } from "./";
import { reducer as historyReducer } from "./history/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<LogsState>({
    list: listReducer,
    history: historyReducer,
});
