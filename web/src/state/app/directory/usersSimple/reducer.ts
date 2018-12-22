import { combineReducers } from 'redux';

import { UserSimpleAction } from './userSimple/actions';
import { reducer as userSimpleReducer, State as UserSimpleState } from './userSimple/reducer';

export type Action = UserSimpleAction;

export type State = {
    userSimple: UserSimpleState;
};

export const reducer = combineReducers({
    userSimple: userSimpleReducer
});
