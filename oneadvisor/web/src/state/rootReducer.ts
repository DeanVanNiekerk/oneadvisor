import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import { reducer as app, State as AppState } from './app/reducer';
import { reducer as auth, State as AuthState } from './auth/reducer';
import { reducer as context, State as ContextState } from './context/reducer';

export type RootState = {
    readonly app: AppState;
    readonly context: ContextState;
    readonly auth: AuthState;
    readonly router: any;
};

const createRootReducer = (history: any) =>
    combineReducers({
        app: app,
        context: context,
        auth: auth,
        router: connectRouter(history),
    });

export default createRootReducer;
