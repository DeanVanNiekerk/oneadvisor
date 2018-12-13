import { combineReducers } from 'redux';

import { Action as ListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { Action as MemberAction } from './member/actions';
import { reducer as memberReducer, State as MemberState } from './member/reducer';

export type Action = ListAction | MemberAction;

export type State = {
    list: ListState;
    member: MemberState;
};

export const reducer = combineReducers({
    list: listReducer,
    member: memberReducer
});
