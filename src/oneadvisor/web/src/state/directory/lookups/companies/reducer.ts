import { combineReducers } from "redux";

import { CompaniesState } from "./";
import { reducer as companyReducer } from "./company/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<CompaniesState>({
    list: listReducer,
    company: companyReducer,
});
