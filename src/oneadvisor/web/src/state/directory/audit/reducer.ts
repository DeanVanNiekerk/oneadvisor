import { combineReducers } from "redux";

import { reducer as logs } from "./logs/reducer";
import { AuditState } from "./types";

export const reducer = combineReducers<AuditState>({
    logs: logs,
});
