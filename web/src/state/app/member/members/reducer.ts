import { combineReducers } from 'redux';

import { MemberListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { MemberAction } from './member/actions';
import { reducer as memberReducer, State as MemberState } from './member/reducer';
import { MemberPreviewAction } from './preview/actions';
import { reducer as memberPreviewReducer, State as MemberPreviewState } from './preview/reducer';
import { MemberSearchAction } from './search/actions';
import { reducer as searchReducer, State as SearchState } from './search/reducer';

export type Action =
    | MemberListAction
    | MemberAction
    | MemberPreviewAction
    | MemberSearchAction;

export type State = {
    list: ListState;
    search: SearchState;
    member: MemberState;
    preview: MemberPreviewState;
};

export const reducer = combineReducers({
    list: listReducer,
    search: searchReducer,
    member: memberReducer,
    preview: memberPreviewReducer
});
