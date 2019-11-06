import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as splitRulePolicyReducer, State as SplitRulePolicyState } from "./splitRulePolicy/reducer";

export type State = {
    list: ListState;
    splitRulePolicy: SplitRulePolicyState;
};

export const reducer = combineReducers({
    list: listReducer,
    splitRulePolicy: splitRulePolicyReducer,
});
