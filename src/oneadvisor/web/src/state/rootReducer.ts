import { connectRouter, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { Reducer } from "redux";

import { reducer as app, State as AppState } from "./app/reducer";
import { reducer as auth, State as AuthState } from "./auth/reducer";
import { ClientState } from "./client/types";
import { ComplianceState } from "./compliance/types";
import { reducer as context, State as ContextState } from "./context/reducer";
import { DirectoryState } from "./directory/types";

export type RootState = {
    //Static Reducers
    readonly app: AppState;
    readonly auth: AuthState;
    readonly context: ContextState;
    readonly router: Reducer<RouterState, LocationChangeAction>;
    //Async Reducers
    readonly directory: DirectoryState;
    readonly client: ClientState;
    readonly compliance: ComplianceState;
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
