import { combineReducers } from "redux";

import { reducer as changeLogReducer } from "./changeLog/reducer";
import { reducer as listReducer } from "./list/reducer";
import { ChangeLogsState } from "./types";

export const reducer = combineReducers<ChangeLogsState>({
    list: listReducer,
    changeLog: changeLogReducer,
});
