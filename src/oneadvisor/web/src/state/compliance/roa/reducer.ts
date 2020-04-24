import { combineReducers } from "redux";

import { RoaState } from "./";
import { reducer as investReducer } from "./invest/reducer";

export const reducer = combineReducers<RoaState>({
    invest: investReducer,
});
