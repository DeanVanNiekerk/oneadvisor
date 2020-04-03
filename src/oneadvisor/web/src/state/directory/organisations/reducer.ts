import { combineReducers } from "redux";

import { OrganisationsState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as organisationReducer } from "./organisation/reducer";

export const reducer = combineReducers<OrganisationsState>({
    list: listReducer,
    organisation: organisationReducer,
});
