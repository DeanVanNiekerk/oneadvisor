import { combineReducers } from 'redux';

import { reducer as listReducer, State as ListState } from './list/reducer';
import { reducer as userSimpleReducer, State as UserSimpleState } from './userSimple/reducer';

export type State = {
    list: ListState;
    userSimple: UserSimpleState;
};

export const reducer = combineReducers({
    list: listReducer,
    userSimple: userSimpleReducer,
});
