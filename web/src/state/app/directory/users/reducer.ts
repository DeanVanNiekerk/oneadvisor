import { combineReducers } from 'redux';

import { UserListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { UserAction } from './user/actions';
import { reducer as userReducer, State as UserState } from './user/reducer';

export type Action = UserListAction | UserAction;

export type State = {
    list: ListState;
    user: UserState;
};

export const reducer = combineReducers({
    list: listReducer,
    user: userReducer
});
