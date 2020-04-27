import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { reducer as policyProductTypeReducer } from "./policyProductType/reducer";
import { PolicyProductTypesState } from "./types";

export const reducer = combineReducers<PolicyProductTypesState>({
    list: listReducer,
    policyProductType: policyProductTypeReducer,
});
