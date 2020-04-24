import { combineReducers } from "redux";

import { LicenseCategoriesState } from "./";
import { reducer as licenseCategoryReducer } from "./licenseCategory/reducer";
import { reducer as listReducer } from "./list/reducer";

export const reducer = combineReducers<LicenseCategoriesState>({
    list: listReducer,
    licenseCategory: licenseCategoryReducer,
});
