import { combineReducers } from 'redux';

import { reducer as listReducer, State as ListState } from './list/reducer';
import { reducer as roleReducer, State as RoleState } from './role/reducer';

export type State = {
    list: ListState;
    role: RoleState;
};

export const reducer = combineReducers({
    list: listReducer,
    role: roleReducer,
});
