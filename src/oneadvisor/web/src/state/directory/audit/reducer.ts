import { combineReducers } from "redux";

import { AuditState } from "./";
import { reducer as logs } from "./logs/reducer";

export const reducer = combineReducers<AuditState>({
    logs: logs,
});
