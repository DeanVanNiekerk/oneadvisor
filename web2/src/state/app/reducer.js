// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import { reducer as directory } from './directory/reducer';
import type { State as DirectoryState, Action as DirectoryAction } from './directory/reducer';

export type Action = 
  | DirectoryAction

export type State = {
  directory: DirectoryState
}

export const reducer: CombinedReducer<State, Action> = combineReducers({
  directory: directory,
});
