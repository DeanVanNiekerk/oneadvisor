import { combineReducers } from "redux";

import { reducer as dataReducer } from "./data/reducer";
import { reducer as inputsReducer } from "./inputs/reducer";
import { RoaInvestState } from "./types";

export const reducer = combineReducers<RoaInvestState>({
    inputs: inputsReducer,
    data: dataReducer,
});