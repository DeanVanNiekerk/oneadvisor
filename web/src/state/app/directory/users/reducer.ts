

import { combineReducers } from 'redux';

import { reducer as listReducer } from './list/reducer';
import { State as ListState } from './list/reducer';
import { Action as ListAction } from './list/actions';

import { reducer as userReducer } from './user/reducer';
import { State as UserState } from './user/reducer';
import { Action as UserAction } from './user/actions';

export type Action = ListAction | UserAction;

export type State = {
    list: ListState,
    user: UserState
};

export const reducer = combineReducers({
    list: listReducer,
    user: userReducer
});
