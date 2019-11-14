import { combineReducers } from "redux";

import { reducer as listReducer, State as ErrorsState } from "./list/reducer";
import { reducer as mappingReducer, State as MappingState } from "./mapping/reducer";

export type State = {
    mapping: MappingState;
    list: ErrorsState;
};

export const reducer = combineReducers({
    mapping: mappingReducer,
    list: listReducer,
});
