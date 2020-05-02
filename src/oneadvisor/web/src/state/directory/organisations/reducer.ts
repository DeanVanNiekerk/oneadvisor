import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { reducer as organisationReducer } from "./organisation/reducer";
import { OrganisationsState } from "./types";

export const reducer = combineReducers<OrganisationsState>({
    list: listReducer,
    organisation: organisationReducer,
});
