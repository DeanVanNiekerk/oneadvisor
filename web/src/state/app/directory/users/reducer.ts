import { combineReducers } from 'redux';

import { Action as ListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { Action as UserAction } from './user/actions';
import { reducer as userReducer, State as UserState } from './user/reducer';



export type Action = ListAction | UserAction;

export type State = {
    list: ListState,
    user: UserState
};

export const reducer = combineReducers({
    list: listReducer,
    user: userReducer
});
