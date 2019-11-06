import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as splitRuleReducer, State as SplitRuleState } from "./splitRule/reducer";

export type State = {
    list: ListState;
    splitRule: SplitRuleState;
};

export const reducer = combineReducers({
    list: listReducer,
    splitRule: splitRuleReducer,
});
