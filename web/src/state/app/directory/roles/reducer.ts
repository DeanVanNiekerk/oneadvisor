import { combineReducers } from 'redux';

import { RoleListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { RoleAction } from './role/actions';
import { reducer as roleReducer, State as RoleState } from './role/reducer';

export type Action = RoleListAction | RoleAction;

export type State = {
    list: ListState;
    role: RoleState;
};

export const reducer = combineReducers({
    list: listReducer,
    role: roleReducer
});
