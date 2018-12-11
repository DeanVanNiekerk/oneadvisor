import { combineReducers } from 'redux';

import { Action as ListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { Action as RoleAction } from './role/actions';
import { reducer as roleReducer, State as RoleState } from './role/reducer';

export type Action = ListAction | RoleAction;

export type State = {
    list: ListState,
    role: RoleState
};

export const reducer = combineReducers({
    list: listReducer,
    role: roleReducer
});
