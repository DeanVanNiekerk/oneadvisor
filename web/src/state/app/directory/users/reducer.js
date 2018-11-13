// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import { reducer as listReducer } from './list/reducer';
import type { State as ListState } from './list/reducer';
import type { Action as ListAction } from './list/actions';

import { reducer as userReducer } from './user/reducer';
import type { State as UserState } from './user/reducer';
import type { Action as UserAction } from './user/actions';

export type Action = ListAction | UserAction;

export type State = {
    list: ListState,
    user: UserState
};

export const reducer: CombinedReducer<State, Action> = combineReducers({
    list: listReducer,
    user: userReducer
});
