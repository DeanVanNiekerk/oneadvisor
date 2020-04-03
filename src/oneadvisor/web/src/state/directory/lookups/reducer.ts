import { combineReducers } from "redux";

import { LookupsState } from "./";
import { reducer as all } from "./all/reducer";
import { reducer as companies } from "./companies/reducer";
import { reducer as userTypes } from "./userTypes/reducer";

export const reducer = combineReducers<LookupsState>({
    all: all,
    companies: companies,
    userTypes: userTypes,
});
