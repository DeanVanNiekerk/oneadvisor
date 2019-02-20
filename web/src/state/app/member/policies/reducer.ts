import { combineReducers } from 'redux';

import { PolicyListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { PolicyAction } from './policy/actions';
import { reducer as policyReducer, State as PolicyState } from './policy/reducer';
import { PolicySearchAction } from './search/actions';
import { reducer as searchReducer, State as SearchState } from './search/reducer';

export type Action = PolicyListAction | PolicyAction | PolicySearchAction;

export type State = {
    list: ListState;
    search: SearchState;
    policy: PolicyState;
};

export const reducer = combineReducers({
    list: listReducer,
    search: searchReducer,
    policy: policyReducer
});
