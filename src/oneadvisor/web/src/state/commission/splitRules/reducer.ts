import { combineReducers } from "redux";

import { SplitRulesState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as splitRuleReducer } from "./splitRule/reducer";

export const reducer = combineReducers<SplitRulesState>({
    list: listReducer,
    splitRule: splitRuleReducer,
});
