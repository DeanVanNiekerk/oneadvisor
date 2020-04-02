import { connectRouter, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";

import { reducer as app, State as AppState } from "./app/reducer";
import { reducer as auth, State as AuthState } from "./auth/reducer";
import { State as ComplianceState } from "./compliance/types";
import { reducer as context, State as ContextState } from "./context/reducer";

export type RootState = {
    readonly app: AppState;
    readonly context: ContextState;
    readonly auth: AuthState;
    readonly compliance: ComplianceState;
    readonly router: Reducer<RouterState, LocationChangeAction>;
};

const createStaticReducers = (history: History) => {
    return {
        app: app,
        context: context,
        auth: auth,
        router: connectRouter(history),
    };
};

export default createStaticReducers;
