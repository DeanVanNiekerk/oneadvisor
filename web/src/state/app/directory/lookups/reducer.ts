import { combineReducers } from 'redux';

import { LookupsAction } from './all/actions';
import { reducer as all, State as LookupsState } from './all/reducer';
import { Action as CompaniesAction, reducer as companies, State as CompaniesState } from './companies/reducer';

export type Action = CompaniesAction | LookupsAction;

export type State = {
    companies: CompaniesState;
    all: LookupsState;
};

export const reducer = combineReducers({
    companies: companies,
    all: all
});
