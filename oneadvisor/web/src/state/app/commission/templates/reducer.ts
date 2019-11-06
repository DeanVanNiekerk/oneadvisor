import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as templateReducer, State as TemplateState } from "./template/reducer";

export type State = {
    list: ListState;
    template: TemplateState;
};

export const reducer = combineReducers({
    list: listReducer,
    template: templateReducer,
});
