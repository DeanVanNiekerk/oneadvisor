import { combineReducers } from "redux";

import { PolicyProductsState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as policyProductReducer } from "./policyProduct/reducer";

export const reducer = combineReducers<PolicyProductsState>({
    list: listReducer,
    policyProduct: policyProductReducer,
});
