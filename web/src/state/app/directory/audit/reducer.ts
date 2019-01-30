import { combineReducers } from 'redux';

import { Action as AuditLogsAction, reducer as logs, State as AuditLogsState } from './logs/reducer';

export type Action = AuditLogsAction;

export type State = {
    logs: AuditLogsState;
};

export const reducer = combineReducers({
    logs: logs
});
