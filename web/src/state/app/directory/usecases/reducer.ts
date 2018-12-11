import { combineReducers } from 'redux';

import { Action as ListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = ListAction;

export type State = {
    list: ListState
};

export const reducer = combineReducers({
    list: listReducer
});
