import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { reducer as policyProductReducer } from "./policyProduct/reducer";
import { PolicyProductsState } from "./types";

export const reducer = combineReducers<PolicyProductsState>({
    list: listReducer,
    policyProduct: policyProductReducer,
});
