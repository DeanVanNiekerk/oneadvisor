import { combineReducers } from "redux";

import { reducer as historyReducer, State as HistoryState } from "./history/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
    history: HistoryState;
};

export const reducer = combineReducers({
    list: listReducer,
    history: historyReducer,
});
