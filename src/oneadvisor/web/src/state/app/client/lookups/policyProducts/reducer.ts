import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import {
    reducer as policyProductReducer,
    State as PolicyProductState,
} from "./policyProduct/reducer";

export type State = {
    list: ListState;
    policyProduct: PolicyProductState;
};

export const reducer = combineReducers({
    list: listReducer,
    policyProduct: policyProductReducer,
});
