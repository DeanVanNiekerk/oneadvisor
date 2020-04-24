import { combineReducers } from "redux";

import { RoaInvestState } from "./";
import { reducer as inputsReducer } from "./inputs/reducer";

export const reducer = combineReducers<RoaInvestState>({
    inputs: inputsReducer,
});
