import { combineReducers } from "redux";

import { AdviceScopesState } from "./";
import { reducer as adviceScopeReducer } from "./adviceScope/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<AdviceScopesState>({
    list: listReducer,
    adviceScope: adviceScopeReducer,
});
