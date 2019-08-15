import { combineReducers } from "redux";

import { reducer as changeLogReducer, State as ChangeLogState } from "./changeLog/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
    changeLog: ChangeLogState;
};

export const reducer = combineReducers({
    list: listReducer,
    changeLog: changeLogReducer,
});
