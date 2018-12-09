

import { combineReducers } from 'redux';

import { reducer as directory } from './directory/reducer';
import { State as DirectoryState, Action as DirectoryAction } from './directory/reducer';

export type Action = 
  | DirectoryAction

export type State = {
  directory: DirectoryState
}

export const reducer = combineReducers({
  directory: directory,
});
