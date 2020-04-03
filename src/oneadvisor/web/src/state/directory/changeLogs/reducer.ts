import { combineReducers } from "redux";

import { ChangeLogsState } from "./";
import { reducer as changeLogReducer } from "./changeLog/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<ChangeLogsState>({
    list: listReducer,
    changeLog: changeLogReducer,
});
