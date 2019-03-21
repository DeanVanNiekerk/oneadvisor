import { combineReducers } from 'redux';

import { reducer as listReducer, State as ListState } from './list/reducer';
import { reducer as memberReducer, State as MemberState } from './member/reducer';
import { reducer as mergeReducer, State as MergeState } from './merge/reducer';
import { reducer as memberPreviewReducer, State as MemberPreviewState } from './preview/reducer';
import { reducer as searchReducer, State as SearchState } from './search/reducer';

export type State = {
    list: ListState;
    search: SearchState;
    member: MemberState;
    preview: MemberPreviewState;
    merge: MergeState;
};

export const reducer = combineReducers({
    list: listReducer,
    search: searchReducer,
    member: memberReducer,
    preview: memberPreviewReducer,
    merge: mergeReducer,
});
