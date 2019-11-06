import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as policyReducer, State as PolicyState } from "./policy/reducer";
import { reducer as searchReducer, State as SearchState } from "./search/reducer";

export type State = {
    list: ListState;
    search: SearchState;
    policy: PolicyState;
};

export const reducer = combineReducers({
    list: listReducer,
    search: searchReducer,
    policy: policyReducer,
});
