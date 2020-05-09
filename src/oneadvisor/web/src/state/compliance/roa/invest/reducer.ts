import { combineReducers } from "redux";

import { reducer as dataReducer } from "./data/reducer";
import { reducer as inputsReducer } from "./inputs/reducer";
import { reducer as lookupsReducer } from "./lookups/reducer";
import { reducer as riskReducer } from "./risk/reducer";
import { RoaInvestState } from "./types";

export const reducer = combineReducers<RoaInvestState>({
    inputs: inputsReducer,
    data: dataReducer,
    lookups: lookupsReducer,
    risk: riskReducer,
});
