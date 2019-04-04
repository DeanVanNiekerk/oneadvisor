import { combineReducers } from 'redux';

import { reducer as all, State as LookupsState } from './all/reducer';
import { reducer as companies, State as CompaniesState } from './companies/reducer';

export type State = {
    all: LookupsState;
    companies: CompaniesState;
};

export const reducer = combineReducers({
    all: all,
    companies: companies,
});
