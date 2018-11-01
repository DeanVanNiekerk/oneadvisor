// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import { reducer as list } from './list/reducer';
import type { State as ListState } from './list/reducer';
import type { Action as ListAction } from './list/actions';

export type Action = 
  | ListAction

export type State = {
  list: ListState
}

export const reducer: CombinedReducer<State, Action> = combineReducers({
  list: list,
});