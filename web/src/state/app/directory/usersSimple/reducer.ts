import { combineReducers } from 'redux';

import { UserSimpleListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { UserSimpleAction } from './userSimple/actions';
import { reducer as userSimpleReducer, State as UserSimpleState } from './userSimple/reducer';

export type Action = UserSimpleAction | UserSimpleListAction;

export type State = {
    list: ListState;
    userSimple: UserSimpleState;
};

export const reducer = combineReducers({
    list: listReducer,
    userSimple: userSimpleReducer
});
