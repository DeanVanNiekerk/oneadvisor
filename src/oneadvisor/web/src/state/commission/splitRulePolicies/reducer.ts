import { combineReducers } from "redux";

import { SplitRulePoliciesState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as splitRulePolicyReducer } from "./splitRulePolicy/reducer";

export const reducer = combineReducers<SplitRulePoliciesState>({
    list: listReducer,
    splitRulePolicy: splitRulePolicyReducer,
});
