import { combineReducers } from "redux";

import { reducer as companyReducer, State as CompanyState } from "./company/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";

export type State = {
    list: ListState;
    company: CompanyState;
};

export const reducer = combineReducers({
    list: listReducer,
    company: companyReducer,
});
