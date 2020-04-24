import { LocationChangeAction, RouterState } from "connected-react-router";
import { Reducer } from "redux";

import { AuthState } from "./auth/types";
import { ClientState } from "./client/types";
import { CommissionState } from "./commission/types";
import { ComplianceState } from "./compliance/types";
import { ContextState } from "./context/types";
import { DirectoryState } from "./directory/types";
import { LookupsState } from "./lookups/types";

export type RootState = {
    //Static Reducers
    readonly auth: AuthState;
    readonly context: ContextState;
    readonly router: Reducer<RouterState, LocationChangeAction>;
    readonly lookups: LookupsState;
    //Async Reducers
    readonly directory: DirectoryState;
    readonly client: ClientState;
    readonly commission: CommissionState;
    readonly compliance: ComplianceState;
};

export type FileInfo = {
    name: string;
    storageName: string;
    url: string;
    size: number;
    contentType: string;
    deleted: boolean;
    created: string;
    lastModified: string;
};
