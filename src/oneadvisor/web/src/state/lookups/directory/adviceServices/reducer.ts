import { combineReducers } from "redux";

import { AdviceServicesState } from "./";
import { reducer as adviceServiceReducer } from "./adviceService/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<AdviceServicesState>({
    list: listReducer,
    adviceService: adviceServiceReducer,
});
