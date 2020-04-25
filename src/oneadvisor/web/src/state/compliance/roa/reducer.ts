import { combineReducers } from "redux";

import { reducer as investReducer } from "./invest/reducer";
import { RoaState } from "./types";

export const reducer = combineReducers<RoaState>({
    invest: investReducer,
});
