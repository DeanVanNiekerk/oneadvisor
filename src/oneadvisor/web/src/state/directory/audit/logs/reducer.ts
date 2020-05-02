import { combineReducers } from "redux";

import { reducer as historyReducer } from "./history/reducer";
import { reducer as listReducer } from "./list/reducer";
import { LogsState } from "./types";

export const reducer = combineReducers<LogsState>({
    list: listReducer,
    history: historyReducer,
});
