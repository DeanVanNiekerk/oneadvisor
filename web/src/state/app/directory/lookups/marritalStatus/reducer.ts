import { combineReducers } from 'redux';

import { MarritalStatusListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = MarritalStatusListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});
