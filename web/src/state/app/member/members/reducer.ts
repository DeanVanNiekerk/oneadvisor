import { combineReducers } from 'redux';

import { MemberListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { MemberAction } from './member/actions';
import { reducer as memberReducer, State as MemberState } from './member/reducer';
import { MemberPreviewAction } from './preview/actions';
import { reducer as memberPreviewReducer, State as MemberPreviewState } from './preview/reducer';

export type Action = MemberListAction | MemberAction | MemberPreviewAction;

export type State = {
    list: ListState;
    member: MemberState;
    preview: MemberPreviewState;
};

export const reducer = combineReducers({
    list: listReducer,
    member: memberReducer,
    preview: memberPreviewReducer
});
