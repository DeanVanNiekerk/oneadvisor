import { combineReducers } from "redux";

import { ClientsState } from "./";
import { reducer as clientReducer } from "./client/reducer";
import { reducer as listReducer } from "./list/reducer";
import { reducer as mergeReducer } from "./merge/reducer";
import { reducer as clientPreviewReducer } from "./preview/reducer";
import { reducer as searchReducer } from "./search/reducer";

export const reducer = combineReducers<ClientsState>({
    list: listReducer,
    search: searchReducer,
    client: clientReducer,
    preview: clientPreviewReducer,
    merge: mergeReducer,
});
