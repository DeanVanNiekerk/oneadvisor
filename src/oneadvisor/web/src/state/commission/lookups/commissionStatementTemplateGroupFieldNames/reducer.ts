import { combineReducers } from "redux";

import { CommissionStatementTemplateGroupFieldNamesState } from "./";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<CommissionStatementTemplateGroupFieldNamesState>({
    list: listReducer,
});
