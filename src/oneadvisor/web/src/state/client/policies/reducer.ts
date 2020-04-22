import { combineReducers } from "redux";

import { PoliciesState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as mergeReducer } from "./merge/reducer";
import { reducer as policyReducer } from "./policy/reducer";
import { reducer as searchReducer } from "./search/reducer";

export const reducer = combineReducers<PoliciesState>({
    list: listReducer,
    search: searchReducer,
    policy: policyReducer,
    merge: mergeReducer,
});
