import { combineReducers } from "redux";

import { PolicyProductTypesState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as policyProductTypeReducer } from "./policyProductType/reducer";

export const reducer = combineReducers<PolicyProductTypesState>({
    list: listReducer,
    policyProductType: policyProductTypeReducer,
});
