import { combineReducers } from 'redux';

import { reducer as listReducer, State as ListState } from './list/reducer';
import { reducer as previewReducer, State as PreviewState } from './preview/reducer';
import { reducer as statementReducer, State as StatementState } from './statement/reducer';

export type State = {
    list: ListState;
    statement: StatementState;
    preview: PreviewState;
};

export const reducer = combineReducers({
    list: listReducer,
    statement: statementReducer,
    preview: previewReducer,
});
