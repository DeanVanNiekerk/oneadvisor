import { combineReducers } from 'redux';

import {
    Action as DirectoryAction, reducer as directory, State as DirectoryState
} from './directory/reducer';



export type Action = 
  | DirectoryAction

export type State = {
  directory: DirectoryState
}

export const reducer = combineReducers({
  directory: directory,
});
