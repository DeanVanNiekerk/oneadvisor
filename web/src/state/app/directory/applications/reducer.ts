import { combineReducers } from 'redux';

import { ApplicationListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = ApplicationListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});
