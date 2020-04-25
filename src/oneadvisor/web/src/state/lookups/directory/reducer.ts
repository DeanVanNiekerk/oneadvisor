import { combineReducers } from "redux";

import { LookupsState } from "./";
import { reducer as adviceScopes } from "./adviceScopes/reducer";
import { reducer as adviceServices } from "./adviceServices/reducer";
import { reducer as all } from "./all/reducer";
import { reducer as branchesSimple } from "./branchesSimple/reducer";
import { reducer as companies } from "./companies/reducer";
import { reducer as licenseCategories } from "./licenseCategories/reducer";
import { reducer as usersSimple } from "./usersSimple/reducer";
import { reducer as userTypes } from "./userTypes/reducer";

export const reducer = combineReducers<LookupsState>({
    all: all,
    companies: companies,
    userTypes: userTypes,
    adviceScopes: adviceScopes,
    adviceServices: adviceServices,
    licenseCategories: licenseCategories,
    branchesSimple: branchesSimple,
    usersSimple: usersSimple,
});
