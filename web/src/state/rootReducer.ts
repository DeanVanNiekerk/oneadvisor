

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { reducer as app } from './app/reducer';
import { State as AppState, Action as AppAction } from './app/reducer';

import { reducer as context } from './context/reducer';
import { State as ContextState } from './context/reducer';

import { reducer as auth } from './auth/reducer';
import { State as AuthState } from './auth/reducer';
import { Action as AuthAction } from './auth/actions';

export type Action = AppAction | AuthAction;

export type State = {
    readonly app: AppState,
    readonly context: ContextState,
    readonly auth: AuthState,
    readonly router: any
};

const createRootReducer = (history: any) =>
    combineReducers({
        app: app,
        context: context,
        auth: auth,
        router: connectRouter(history)
    });

export default createRootReducer;
