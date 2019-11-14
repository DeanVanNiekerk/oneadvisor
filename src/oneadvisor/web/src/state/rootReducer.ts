import { connectRouter, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";

import { reducer as app, State as AppState } from "./app/reducer";
import { reducer as auth, State as AuthState } from "./auth/reducer";
import { reducer as context, State as ContextState } from "./context/reducer";

export type RootState = {
    readonly app: AppState;
    readonly context: ContextState;
    readonly auth: AuthState;
    readonly router: Reducer<RouterState, LocationChangeAction>;
};

const createRootReducer = (history: History) =>
    combineReducers({
        app: app,
        context: context,
        auth: auth,
        router: connectRouter(history),
    });

export default createRootReducer;
