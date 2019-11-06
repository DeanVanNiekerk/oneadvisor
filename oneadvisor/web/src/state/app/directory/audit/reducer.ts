import { combineReducers } from "redux";

import { reducer as logs, State as AuditLogsState } from "./logs/reducer";

export type State = {
    logs: AuditLogsState;
};

export const reducer = combineReducers({
    logs: logs,
});
