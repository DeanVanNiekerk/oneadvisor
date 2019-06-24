import { combineReducers } from 'redux';

import { reducer as clientReducer, State as ClientState } from './client/reducer';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { reducer as mergeReducer, State as MergeState } from './merge/reducer';
import { reducer as clientPreviewReducer, State as ClientPreviewState } from './preview/reducer';
import { reducer as searchReducer, State as SearchState } from './search/reducer';

export type State = {
    list: ListState;
    search: SearchState;
    client: ClientState;
    preview: ClientPreviewState;
    merge: MergeState;
};

export const reducer = combineReducers({
    list: listReducer,
    search: searchReducer,
    client: clientReducer,
    preview: clientPreviewReducer,
    merge: mergeReducer,
});
