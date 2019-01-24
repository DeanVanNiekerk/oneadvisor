import { combineReducers } from 'redux';

import { PolicyTypeListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = PolicyTypeListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});
