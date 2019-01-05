import { combineReducers } from 'redux';

import { Action as CompaniesAction, reducer as companies, State as CompaniesState } from './companies/reducer';

export type Action = CompaniesAction;

export type State = {
    companies: CompaniesState;
};

export const reducer = combineReducers({
    companies: companies
});
