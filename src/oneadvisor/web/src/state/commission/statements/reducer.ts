import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { getPersistStorage } from "@/state/storage";

import { reducer as filesReducer } from "./files/reducer";
import { reducer as listReducer } from "./list/reducer";
import { reducer as previewReducer } from "./preview/reducer";
import { reducer as statementReducer } from "./statement/reducer";
import { ListState, StatementsState } from "./types";

const listConfig: PersistConfig<ListState> = {
    key: "commission-statements-list",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

export const reducer = combineReducers<StatementsState>({
    list: persistReducer(listConfig, listReducer),
    statement: statementReducer,
    preview: previewReducer,
    files: filesReducer,
});
