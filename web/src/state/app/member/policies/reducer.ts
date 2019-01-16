import { combineReducers } from 'redux';

import { PolicyListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { PolicyAction } from './policy/actions';
import { reducer as policyReducer, State as PolicyState } from './policy/reducer';

export type Action = PolicyListAction | PolicyAction;

export type State = {
    list: ListState;
    policy: PolicyState;
};

export const reducer = combineReducers({
    list: listReducer,
    policy: policyReducer
});
