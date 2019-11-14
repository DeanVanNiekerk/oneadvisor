import { combineReducers } from "redux";

import { reducer as filesReducer, State as FilesState } from "./files/reducer";
import { reducer as listReducer, State as ListState } from "./list/reducer";
import { reducer as previewReducer, State as PreviewState } from "./preview/reducer";
import { reducer as statementReducer, State as StatementState } from "./statement/reducer";

export type State = {
    list: ListState;
    statement: StatementState;
    preview: PreviewState;
    files: FilesState;
};

export const reducer = combineReducers({
    list: listReducer,
    statement: statementReducer,
    preview: previewReducer,
    files: filesReducer,
});
