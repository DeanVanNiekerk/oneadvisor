import { combineReducers } from 'redux';

import { AuditLogListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = AuditLogListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});
