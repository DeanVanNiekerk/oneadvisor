import { combineReducers } from "redux";

import { reducer as client, State as ClientState } from "./client/reducer";
import { reducer as commission, State as CommissionState } from "./commission/reducer";

export type State = {
    client: ClientState;
    commission: CommissionState;
};

export const reducer = combineReducers({
    client: client,
    commission: commission,
});
