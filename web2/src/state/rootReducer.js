// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';
import type { RouterState } from './types';

import { reducer as app } from './app/reducer';
import type { State as AppState, Action as AppAction } from './app/reducer';

import { reducer as context } from './context/reducer';
import type { State as ContextState, Action as ContextAction } from './context/reducer';

import { reducer as auth } from './auth/reducer';
import type { State as AuthState } from './auth/reducer';
import type { Action as AuthAction } from './auth/actions';

export type Action = 
  | AppAction
  | ContextAction
  | AuthAction

export type State = {
  +app: AppState,
  +context: ContextState,
  +auth: AuthState,
  +router?: RouterState
}

const rootReducer: CombinedReducer<State, Action> = combineReducers({
    app: app,
    context: context,
    auth: auth
});

export default rootReducer;