import { combineReducers } from 'redux';

import { UseCaseListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = UseCaseListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});
