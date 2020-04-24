import { combineReducers } from "redux";

import { reducer as roaReducer } from "./roa/reducer";
import { ComplianceState } from "./types";

export const reducer = combineReducers<ComplianceState>({
    roa: roaReducer,
});
