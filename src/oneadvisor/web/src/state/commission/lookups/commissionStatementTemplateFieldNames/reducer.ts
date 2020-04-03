import { combineReducers } from "redux";

import { CommissionStatementTemplateFieldNamesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<CommissionStatementTemplateFieldNamesState>({
    list: listReducer,
});
