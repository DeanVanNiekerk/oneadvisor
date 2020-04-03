import { combineReducers } from "redux";

import { ErrorsState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as mappingReducer } from "./mapping/reducer";

export { ErrorsState } from "./";

export const reducer = combineReducers<ErrorsState>({
    mapping: mappingReducer,
    list: listReducer,
});
