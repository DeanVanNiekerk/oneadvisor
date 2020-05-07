import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { getPersistStorage } from "@/state/storage";

import { ErrorsState, ListState } from "./";
import { reducer as listReducer } from "./list/reducer";
import { reducer as mappingReducer } from "./mapping/reducer";

const listConfig: PersistConfig<ListState> = {
    key: "commission-errors-list",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

export const reducer = combineReducers<ErrorsState>({
    mapping: mappingReducer,
    list: persistReducer(listConfig, listReducer),
});
