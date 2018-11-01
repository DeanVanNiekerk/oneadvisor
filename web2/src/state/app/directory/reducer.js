// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import { reducer as users } from './users/reducer';
import type { State as UsersState, Action as UsersAction } from './users/reducer';

export type Action = 
  | UsersAction

export type State = {
  users: UsersState
}

export const reducer: CombinedReducer<State, Action> = combineReducers({
  users: users,
});