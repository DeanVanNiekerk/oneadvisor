import { combineReducers } from "redux";

import { reducer as all, State as LookupsState } from "./all/reducer";
import { reducer as companies, State as CompaniesState } from "./companies/reducer";
import { reducer as userTypes, State as UserTypesState } from "./userTypes/reducer";

export type State = {
    all: LookupsState;
    companies: CompaniesState;
    userTypes: UserTypesState;
};

export const reducer = combineReducers({
    all: all,
    companies: companies,
    userTypes: userTypes,
});
