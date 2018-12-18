import { combineReducers } from 'redux';

import { MemberListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { MemberAction } from './member/actions';
import { reducer as memberReducer, State as MemberState } from './member/reducer';

export type Action = MemberListAction | MemberAction;

export type State = {
    list: ListState;
    member: MemberState;
};

export const reducer = combineReducers({
    list: listReducer,
    member: memberReducer
});
