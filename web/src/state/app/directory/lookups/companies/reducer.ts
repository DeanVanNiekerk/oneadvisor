import { combineReducers } from 'redux';

import { CompanyAction } from './company/actions';
import { reducer as companyReducer, State as CompanyState } from './company/reducer';
import { CompanyListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = CompanyListAction | CompanyAction;

export type State = {
    list: ListState;
    company: CompanyState;
};

export const reducer = combineReducers({
    list: listReducer,
    company: companyReducer
});
