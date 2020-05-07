import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { getPersistStorage } from "@/state/storage";

import { reducer as clientReducer } from "./client/reducer";
import { reducer as listReducer } from "./list/reducer";
import { reducer as mergeReducer } from "./merge/reducer";
import { reducer as clientPreviewReducer } from "./preview/reducer";
import { ClientsState, ListState } from "./types";

const listConfig: PersistConfig<ListState> = {
    key: "client-clients-list",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

export const reducer = combineReducers<ClientsState>({
    list: persistReducer(listConfig, listReducer),
    client: clientReducer,
    preview: clientPreviewReducer,
    merge: mergeReducer,
});
