import { combineReducers } from "redux";

import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as organisationReducer, State as OrganisationState } from "./organisation/reducer";

export type State = {
    list: ListState;
    organisation: OrganisationState;
};

export const reducer = combineReducers({
    list: listReducer,
    organisation: organisationReducer,
});
